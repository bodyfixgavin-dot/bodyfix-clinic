import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { FASCIA_LINE_OPTIONS, PUBLIC_BOOKING_SERVICE_CODES } from "@/lib/booking-services";

const schema = z.object({
  serviceCode: z.string().trim().min(1),
  serviceId: z.string().uuid().optional().nullable(),
  serviceName: z.string().trim().min(1).max(150),
  selectedFasciaLineCode: z.string().trim().max(20).optional().nullable(),
  selectedFasciaLineName: z.string().trim().max(100).optional().nullable(),
  clientName: z.string().trim().min(1).max(80),
  lineId: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40).optional().nullable(),
  bodyCondition: z.string().trim().max(1200).optional().nullable(),
  preferredDate: z.string().trim().max(100).optional().nullable(),
  preferredTimeRange: z.string().trim().max(100).optional().nullable(),
  acceptLastMinuteSlot: z.string().trim().max(40).optional().nullable(),
  note: z.string().trim().max(1200).optional().nullable(),
  source: z.string().trim().max(80).default("booking"),
  quizResultType: z.string().trim().max(80).optional().nullable(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !PUBLIC_BOOKING_SERVICE_CODES.has(parsed.data?.serviceCode ?? "")) {
    return NextResponse.json({ success: false, error: "Invalid booking input" }, { status: 400 });
  }
  const input = parsed.data;
  const expectsLine = input.serviceCode === "fascia_line_selected_reset_60";
  const line = FASCIA_LINE_OPTIONS.find((item) => item.code === input.selectedFasciaLineCode);
  if (expectsLine && (!line || line.name !== input.selectedFasciaLineName)) {
    return NextResponse.json({ success: false, error: "Invalid fascia line" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Booking database is not configured" }, { status: 503 });
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id,code,display_name_zh,name")
    .eq("code", input.serviceCode)
    .eq("is_active", true)
    .single();
  if (serviceError || !service) {
    return NextResponse.json({ success: false, error: "Booking service is unavailable" }, { status: 503 });
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .upsert({ client_name: input.clientName, line_id: input.lineId, phone: input.phone || null }, { onConflict: "line_id" })
    .select("id")
    .single();
  if (clientError || !client) {
    return NextResponse.json({ success: false, error: clientError?.message ?? "Unable to save client" }, { status: 500 });
  }

  const { data: booking, error } = await supabase.from("booking_requests").insert({
    slot_id: null,
    service_id: service.id,
    client_id: client.id,
    client_name: input.clientName,
    line_id: input.lineId,
    phone: input.phone || null,
    body_notes: input.bodyCondition || null,
    message: input.note || null,
    status: "pending_confirmation",
    source: input.source,
    service_code: service.code,
    service_name: service.display_name_zh || service.name,
    selected_fascia_line_code: expectsLine ? line?.code : null,
    selected_fascia_line_name: expectsLine ? line?.name : null,
    preferred_date: input.preferredDate || null,
    preferred_time_range: input.preferredTimeRange || null,
    accept_last_minute_slot: input.acceptLastMinuteSlot || null,
    quiz_result_type: input.quizResultType || null,
  }).select("id").single();

  if (error || !booking) {
    return NextResponse.json({ success: false, error: error?.message ?? "Unable to save booking" }, { status: 500 });
  }
  return NextResponse.json({ success: true, bookingId: booking.id, status: "pending_confirmation" }, { status: 201 });
}

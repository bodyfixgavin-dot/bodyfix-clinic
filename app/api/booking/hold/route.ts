import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const holdBookingSchema = z.object({
  slot_id: z.string().uuid(),
  service_id: z.string().uuid(),
  client_name: z.string().trim().min(1).max(80),
  line_id: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(40).optional().nullable(),
  body_notes: z.string().trim().max(1200).optional().nullable(),
  message: z.string().trim().max(1200).optional().nullable(),
  selectedFasciaLineCode: z.string().trim().max(20).optional(),
  selectedFasciaLineName: z.string().trim().max(100).optional(),
  serviceCode: z.string().trim().min(1).max(100),
  serviceName: z.string().trim().min(1).max(150),
  source: z.string().trim().max(80).default("booking"),
  quizResultType: z.string().trim().max(80).optional().nullable(),
});

export async function POST(req: Request) {
  const parsed = holdBookingSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking input" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin environment is not configured" },
      { status: 500 },
    );
  }

  const input = parsed.data;
  const fasciaLineNote = input.selectedFasciaLineName
    ? `指定筋膜線：${input.selectedFasciaLineName} (${input.selectedFasciaLineCode})`
    : "";
  const message = [input.message, fasciaLineNote].filter(Boolean).join("\n");

  const { data, error } = await supabase.rpc("hold_booking_slot", {
    p_slot_id: input.slot_id,
    p_service_id: input.service_id,
    p_client_name: input.client_name,
    p_line_id: input.line_id,
    p_phone: input.phone || null,
    p_body_notes: input.body_notes || null,
    p_message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.success || !data.booking_id) {
    return NextResponse.json(data ?? { success: false, message: "Unable to hold this booking slot." });
  }

  const { error: metadataError } = await supabase.from("booking_requests").update({
    source: input.source,
    service_code: input.serviceCode,
    service_name: input.serviceName,
    selected_fascia_line_code: input.selectedFasciaLineCode || null,
    selected_fascia_line_name: input.selectedFasciaLineName || null,
    quiz_result_type: input.quizResultType || null,
  }).eq("id", data.booking_id);
  if (metadataError) {
    await supabase.from("booking_requests").delete().eq("id", data.booking_id);
    return NextResponse.json({ success: false, error: metadataError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

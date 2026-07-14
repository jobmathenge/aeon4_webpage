import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await seedStats();
  await seedCopilots();
  await seedQA();
  await seedTicker();
}

async function seedStats() {
  const stats = [
    { value: 'L0–L4', label: 'Purdue coverage', order: 0 },
    { value: '12+', label: 'OT protocols decoded', order: 1 },
    { value: '100%', label: 'on-prem deployable', order: 2 },
    { value: '<2 wks', label: 'pilot to first insight', order: 3 },
  ];
  for (const stat of stats) {
    const existing = await prisma.stat.findFirst({ where: { order: stat.order } });
    if (existing) {
      await prisma.stat.update({ where: { id: existing.id }, data: stat });
    } else {
      await prisma.stat.create({ data: stat });
    }
  }
}

async function seedCopilots() {
  const copilots = [
    {
      id: 'security',
      order: 0,
      tag: '01 / Watch',
      title: 'Security Copilot',
      cardSubtitle: 'A guard for your plant network that never sleeps.',
      cardDescription:
        'AI-assisted OT threat detection, triage, and response guidance for engineers — not just SOC analysts. Understands industrial protocols natively and maps findings to MITRE ATT&CK for ICS.',
      heroDescription:
        'Continuous OT threat detection across Purdue levels — protocol-aware network sensing, SIEM correlation, and IEC 62443 zone & conduit awareness, explained in plain language by an AI that knows your plant.',
      protocolBadge: 'ZEEK · SURICATA · WAZUH · MITRE ATT&CK FOR ICS',
      heroWord: 'WATCH',
      chip1Value: '3',
      chip1Label: 'threats flagged\nthis shift',
      chip2Value: 'T0836',
      chip2Label: 'mapped to\nATT&CK for ICS',
      accentColor: 'sonar',
      icon: 'i-shield',
      features: [
        'Protocol-aware sensing (Zeek / Suricata)',
        'SIEM correlation & Wazuh integration',
        'IEC 62443 zone & conduit context',
        'Plain-language incident narratives',
      ],
    },
    {
      id: 'bms',
      order: 1,
      tag: '02 / Breathe',
      title: 'BMS Copilot',
      cardSubtitle: 'Your buildings, aware of themselves.',
      cardDescription:
        'Digital twins of AHUs, chillers, and district energy plants that explain themselves. Detects drift, sequences faults, and answers "why is this floor hot?" with evidence, not guesses.',
      heroDescription:
        'Digital twins of AHUs, chillers, and district energy plants that explain themselves — fault detection, comfort diagnostics, and energy optimisation grounded in real equipment models.',
      protocolBadge: 'BACNET · DIGITAL TWINS · FDD · ENERGY OPTIMISATION',
      heroWord: 'BREATHE',
      chip1Value: '−18%',
      chip1Label: 'energy drift\ncaught early',
      chip2Value: 'AHU-03',
      chip2Label: 'fault isolated\nin minutes',
      accentColor: 'biolum',
      icon: 'i-building',
      features: [
        'BACnet-native equipment models',
        'AHU & chiller plant digital twins',
        'Fault detection & diagnostics (FDD)',
        'Energy & comfort optimisation',
      ],
    },
    {
      id: 'iot',
      order: 2,
      tag: '03 / Produce',
      title: 'Production IoT Copilot',
      cardSubtitle: 'Your production line, explaining itself.',
      cardDescription:
        'ISA-95 namespaced telemetry from line to enterprise. Watches OEE, spots anomalies in process data, and links production events to their upstream causes in seconds.',
      heroDescription:
        'ISA-95 namespaced telemetry from line to enterprise — anomaly detection on process data, OEE tracking, and root-cause hints that link production events to their upstream causes.',
      protocolBadge: 'MQTT · OPC UA · MODBUS TCP · ISA-95 UNS',
      heroWord: 'PRODUCE',
      chip1Value: '84%',
      chip1Label: 'line-4 OEE\nlive tracked',
      chip2Value: '+14s',
      chip2Label: 'cycle drift vs\ngolden batch',
      accentColor: 'beacon',
      icon: 'i-factory',
      features: [
        'MQTT / OPC UA / Modbus ingestion',
        'ISA-95 unified namespace',
        'Anomaly detection on process data',
        'OEE & downtime root-cause hints',
      ],
    },
  ];

  for (const { features, ...copilot } of copilots) {
    await prisma.copilot.upsert({
      where: { id: copilot.id },
      update: copilot,
      create: copilot,
    });
    await prisma.copilotFeature.deleteMany({ where: { copilotId: copilot.id } });
    await prisma.copilotFeature.createMany({
      data: features.map((text, order) => ({ copilotId: copilot.id, text, order })),
    });
  }
}

async function seedQA() {
  const entries = [
    {
      topic: 'security',
      order: 0,
      question: 'why is PLC-EXT-02 flagged this morning?',
      answer:
        'At 06:41 a WRITE_COIL from 10.20.4.7 (engineering WS, Zone E-2) targeted PLC-EXT-02 in Zone P-1 — outside its learned baseline and outside the approved conduit. No matching change ticket found. Mapped to ATT&CK for ICS T0836 (Modify Parameter). Suggested: verify with shift engineer, then isolate the conduit if unconfirmed.',
    },
    {
      topic: 'bms',
      order: 0,
      question: 'why is level 3 east running warm?',
      answer:
        'AHU-03 serving L3-East shows supply air temp drifting +2.1°C over 4h. Chilled-water valve commanded 100% but ΔT across the coil is low — consistent with a fouled coil or CHW supply issue, not a setpoint problem. Plant CHW ΔT is also below design. Suggested: check strainer on AHU-03 CHW branch first.',
    },
    {
      topic: 'iot',
      order: 0,
      question: 'what dropped OEE on line 4?',
      answer:
        'Line-4 OEE fell 6% between 09:10–09:35, driven by availability. Namespace trace: infeed conveyor CNV-4A reported 3 micro-stops (motor overload warnings) starting 09:08 — each stall starved the filler 90s later. Quality and performance held steady. Suggested: inspect CNV-4A drive; pattern matches last Tuesday\'s event.',
    },
  ];

  for (const entry of entries) {
    const existing = await prisma.qAEntry.findFirst({
      where: { topic: entry.topic, order: entry.order },
    });
    if (existing) {
      await prisma.qAEntry.update({ where: { id: existing.id }, data: entry });
    } else {
      await prisma.qAEntry.create({ data: entry });
    }
  }
}

async function seedTicker() {
  const events = [
    { category: 'security', message: 'MODBUS WRITE_COIL 10.20.4.7 → PLC-EXT-02 · out-of-baseline · flagged' },
    { category: 'bms', message: 'AHU-03 supply temp drift +2.1°C · FDD case opened' },
    { category: 'iot', message: 'Line-4 OEE dip −6% · correlated: upstream conveyor stall' },
    { category: 'security', message: 'New asset on L2 VLAN · fingerprint: engineering workstation' },
    { category: 'bms', message: 'CHW plant ΔT low · staging suggestion drafted' },
    { category: 'iot', message: 'MQTT topic storm on plant/utilities/# · rate-limited' },
    { category: 'security', message: 'OPC UA session from untrusted zone · conduit policy check' },
    { category: 'bms', message: 'VAV-2-14 damper hunting · maintenance hint issued' },
    { category: 'iot', message: 'Batch 8842 cycle time +14s vs golden batch · review queued' },
    { category: 'security', message: 'Suricata sig 2049810 matched · mapped: T0846 remote discovery' },
  ];

  for (const [order, event] of events.entries()) {
    const existing = await prisma.tickerEvent.findFirst({ where: { order } });
    if (existing) {
      await prisma.tickerEvent.update({ where: { id: existing.id }, data: { ...event, order } });
    } else {
      await prisma.tickerEvent.create({ data: { ...event, order } });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

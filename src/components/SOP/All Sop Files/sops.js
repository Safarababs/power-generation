// sops.js
const sops = [
  {
    id: 1,
    title: "Start-up Procedure",
    content: `
    Step 1: Check fuel levels and quality.
    Step 2: Inspect lubrication oil system.
    Step 3: Prime fuel and lube pumps.
    Step 4: Verify cooling water circulation.
    Step 5: Ensure air intake filters are clean.
    Step 6: Engage turning gear for pre-check rotation.
    Step 7: Reset alarms and safety interlocks.
    Step 8: Initiate pre-lubrication sequence.
    Step 9: Start engine at low load.
    Step 10: Gradually increase load while monitoring parameters.
    `,
  },
  {
    id: 2,
    title: "Shutdown Procedure",
    content: `
    Step 1: Gradually reduce engine load.
    Step 2: Switch to idle speed for cooling.
    Step 3: Monitor exhaust temperatures.
    Step 4: Stop fuel supply to injectors.
    Step 5: Allow engine to run until fuel clears.
    Step 6: Stop engine completely.
    Step 7: Engage turning gear for safe stop.
    Step 8: Record shutdown parameters.
    Step 9: Inspect for leaks or abnormal noises.
    Step 10: Secure auxiliary systems.
    `,
  },
  {
    id: 3,
    title: "Emergency SOP",
    content: `
    Step 1: Trigger alarm immediately.
    Step 2: Isolate affected system.
    Step 3: Cut off fuel supply.
    Step 4: Shut down engine safely.
    Step 5: Engage fire suppression if needed.
    Step 6: Evacuate personnel if required.
    Step 7: Inform control room and supervisor.
    Step 8: Record incident details.
    Step 9: Begin troubleshooting root cause.
    Step 10: Do not restart until clearance is given.
    `,
  },
  {
    id: 4,
    title: "Lubrication System SOP",
    content: `
    Step 1: Check oil levels before operation.
    Step 2: Inspect filters for clogging.
    Step 3: Prime lubrication pumps.
    Step 4: Verify oil pressure gauges.
    Step 5: Monitor oil temperature.
    Step 6: Replace filters as per schedule.
    Step 7: Drain sludge from separators.
    Step 8: Record oil consumption.
    Step 9: Inspect for leaks in pipelines.
    Step 10: Maintain oil quality with regular sampling.
    `,
  },
  {
    id: 5,
    title: "Fuel System SOP",
    content: `
    Step 1: Check fuel tank levels.
    Step 2: Inspect fuel filters.
    Step 3: Prime fuel pumps.
    Step 4: Monitor fuel pressure.
    Step 5: Ensure fuel temperature is within limits.
    Step 6: Switch between tanks if required.
    Step 7: Drain water from fuel separators.
    Step 8: Record fuel consumption.
    Step 9: Inspect injectors for leakage.
    Step 10: Maintain cleanliness of fuel system.
    `,
  },
  {
    id: 6,
    title: "Cooling Water SOP",
    content: `
    Step 1: Check water levels in expansion tank.
    Step 2: Inspect pumps for proper operation.
    Step 3: Verify cooling water pressure.
    Step 4: Monitor inlet and outlet temperatures.
    Step 5: Clean strainers regularly.
    Step 6: Check for leaks in pipelines.
    Step 7: Ensure jacket water heaters are functional.
    Step 8: Record temperature readings.
    Step 9: Maintain chemical treatment levels.
    Step 10: Flush system periodically.
    `,
  },
  {
    id: 7,
    title: "Air Intake SOP",
    content: `
    Step 1: Inspect air filters for cleanliness.
    Step 2: Check turbocharger condition.
    Step 3: Verify air pressure readings.
    Step 4: Ensure intake valves are clear.
    Step 5: Monitor boost pressure during operation.
    Step 6: Clean filters as per schedule.
    Step 7: Inspect silencers for blockages.
    Step 8: Record air pressure trends.
    Step 9: Check for abnormal noises.
    Step 10: Maintain intake duct integrity.
    `,
  },
  {
    id: 8,
    title: "Electrical System SOP",
    content: `
    Step 1: Inspect control panels.
    Step 2: Verify sensor connections.
    Step 3: Check generator output.
    Step 4: Test alarms and interlocks.
    Step 5: Monitor voltage stability.
    Step 6: Inspect wiring for damage.
    Step 7: Record electrical readings.
    Step 8: Test emergency shutdown circuits.
    Step 9: Ensure grounding is intact.
    Step 10: Maintain log of electrical faults.
    `,
  },
  {
    id: 9,
    title: "Routine Maintenance SOP",
    content: `
    Step 1: Inspect engine visually.
    Step 2: Check lubrication system.
    Step 3: Clean filters and strainers.
    Step 4: Inspect cooling water system.
    Step 5: Check fuel injectors.
    Step 6: Verify electrical connections.
    Step 7: Record operational parameters.
    Step 8: Replace worn-out parts.
    Step 9: Test safety systems.
    Step 10: Update maintenance log.
    `,
  },
  {
    id: 10,
    title: "Safety SOP",
    content: `
    Step 1: Wear PPE before entering engine room.
    Step 2: Check fire extinguishers.
    Step 3: Verify emergency exits are clear.
    Step 4: Test alarm systems.
    Step 5: Ensure first aid kit availability.
    Step 6: Record safety checks.
    Step 7: Train personnel regularly.
    Step 8: Inspect safety signage.
    Step 9: Report hazards immediately.
    Step 10: Follow lockout-tagout procedures.
    `,
  },
];

export default sops;

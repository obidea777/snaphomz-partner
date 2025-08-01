'use client';

import { useState } from 'react';
import { Stepper, Button, Group, Text, Box, Paper, Badge } from '@mantine/core';
import { Check, Info } from 'lucide-react';



type StepData = {
  label: string;
  description: string;
  status?: 'completed' | 'active' | 'incomplete' | 'action-required';
  content?: React.ReactNode;
};

interface VerticalStepperProps {
  steps: StepData[];
}

export default function VerticalStepper({ steps }: VerticalStepperProps) {
  const [active, setActive] = useState(0);

  const nextStep = () => setActive((current) => (current < steps.length - 1 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Box maw={600} mx="auto">
      <Stepper active={active} orientation="vertical" allowNextStepsSelect>
        {steps.map((step, index) => (
          <Stepper.Step
            key={index}
            label={step.label}
            description={step.description}
            icon={step.status === 'completed' ? <Check size={16} /> : undefined}
          >
            <Paper shadow="sm" p="md" className="bg-white mt-2 border rounded-lg">
              {step.status === 'action-required' && (
                <Badge color="red" leftSection={<Info size={12} />}>
                  Action Required
                </Badge>
              )}
              <div className="mt-2">{step.content}</div>

              <Group  mt="md">
                <Button variant="default" onClick={prevStep} disabled={index === 0}>
                  Back
                </Button>
                <Button onClick={nextStep} disabled={index === steps.length - 1}>
                  Next
                </Button>
              </Group>
            </Paper>
          </Stepper.Step>
        ))}
      </Stepper>
    </Box>
  );
}

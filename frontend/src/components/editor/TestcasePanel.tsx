import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';

interface TestcasePanelProps {
  input: string;
  output: string;
  setInput: (value: string) => void;
  setOutput: (value: string) => void;
}

export const TestcasePanel = ({ input, output, setInput, setOutput }: TestcasePanelProps) => (
  <Card className="space-y-3">
    <h3 className="text-sm font-semibold text-white">Custom Testcases</h3>
    <Input value={input} onChange={(event) => setInput(event.target.value)} label="Input" placeholder="1 2 3 4" />
    <Input
      value={output}
      onChange={(event) => setOutput(event.target.value)}
      label="Expected Output"
      placeholder="10"
    />
  </Card>
);

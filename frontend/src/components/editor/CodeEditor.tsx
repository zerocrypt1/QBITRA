import MonacoEditor from '@monaco-editor/react';
import { Card } from '@/components/common/Card';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ language, value, onChange }: CodeEditorProps) => (
  <Card className="overflow-hidden p-0" hover={false}>
    <MonacoEditor
      height="420px"
      theme="vs-dark"
      language={language}
      value={value}
      onChange={(next) => onChange(next ?? '')}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: 'JetBrains Mono',
        smoothScrolling: true,
        scrollBeyondLastLine: false,
      }}
    />
  </Card>
);

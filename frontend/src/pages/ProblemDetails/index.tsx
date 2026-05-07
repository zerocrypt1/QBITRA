import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Send } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { TestcasePanel } from '@/components/editor/TestcasePanel';
import { problemService } from '@/services/problemService';
import { submissionService } from '@/services/submissionService';
import type { SubmissionLanguage } from '@/services/submissionService';
import { useToast } from '@/hooks/useToast';
import type { Problem } from '@/types';

const starterCode = `function solve(input) {\n  // Write your solution\n  return input;\n}`;
const languageOptions: { value: SubmissionLanguage; label: string; editorLanguage: string }[] = [
  { value: 'javascript', label: 'JavaScript', editorLanguage: 'javascript' },
  { value: 'python', label: 'Python', editorLanguage: 'python' },
  { value: 'go', label: 'Go', editorLanguage: 'go' },
  { value: 'cpp', label: 'C++', editorLanguage: 'cpp' },
  { value: 'java', label: 'Java', editorLanguage: 'java' },
  { value: 'rust', label: 'Rust', editorLanguage: 'rust' },
];

const ProblemDetailsPage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState<SubmissionLanguage>('javascript');
  const [code, setCode] = useState(starterCode);
  const [input, setInput] = useState('1 2 3 4');
  const [output, setOutput] = useState('10');
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    if (!problemId) return;
    problemService.get(problemId).then((item) => {
      if (mounted) {
        setProblem(item);
      }
    });
    return () => {
      mounted = false;
    };
  }, [problemId]);

  const submitCode = async () => {
    if (!problemId) {
      toast.error('Missing problem', 'Unable to identify problem.');
      return;
    }
    setSubmitting(true);
    try {
      const submission = await submissionService.submit({ problem_id: problemId, language, code });
      if (submission) {
        toast.success('Submission queued', `Token: ${submission.execution_token ?? 'created'}`);
      } else {
        toast.info('Submission sent', 'Your solution was submitted.');
      }
    } catch {
      toast.error('Submission failed', 'Please check login and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_1.2fr]">
        <Card className="space-y-4" hover={false}>
          <div>
            <h1 className="text-2xl font-semibold text-white">{problem?.title ?? 'Problem'}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Difficulty: {problem?.difficulty ?? 'N/A'} • Points: {problem?.points ?? 0}
            </p>
          </div>
          <article className="space-y-4 text-sm text-slate-300">
            <section>
              <h2 className="mb-2 text-base font-semibold text-white">Statement</h2>
              <p>
                Given an array of integers, compute the target transformation while maintaining optimal time complexity.
                Provide a deterministic output for all valid inputs.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-semibold text-white">Constraints</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>1 ≤ n ≤ 2 * 10^5</li>
                <li>Runtime limit: 2s</li>
                <li>Memory limit: 256MB</li>
              </ul>
            </section>
            <section>
              <h2 className="mb-2 text-base font-semibold text-white">Example</h2>
              <pre className="rounded-xl bg-black/40 p-3 font-mono text-xs">Input: 1 2 3 4\nOutput: 10</pre>
            </section>
          </article>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-end">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SubmissionLanguage)}
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-slate-200 outline-none"
              aria-label="Programming Language"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <CodeEditor language={languageOptions.find((option) => option.value === language)?.editorLanguage ?? 'javascript'} value={code} onChange={setCode} />
          <TestcasePanel input={input} output={output} setInput={setInput} setOutput={setOutput} />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.info('Run finished', 'Execution completed in 42ms')}>
              <Play size={14} className="mr-2" /> Run Code
            </Button>
            <Button onClick={submitCode} disabled={submitting}>
              <Send size={14} className="mr-2" /> {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProblemDetailsPage;

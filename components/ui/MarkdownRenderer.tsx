import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    // If the content is already HTML (from older posts), we still need to render it as HTML safely
    // But since the request is to fix markdown formatting, we assume the content is primarily markdown now.
    // To handle legacy HTML posts seamlessly without a complex hybrid parser, 
    // we can check if it starts with HTML tags. If it's mostly HTML, we might need to use dangerouslySetInnerHTML
    // as a fallback. However, for a pure Markdown approach, ReactMarkdown is best.
    
    const isHtml = content.trim().startsWith('<') && content.includes('</h1>');
    
    if (isHtml) {
         return (
             <div 
                className={`prose prose-lg prose-indigo prose-img:rounded-2xl max-w-none ${className}`}
                dangerouslySetInnerHTML={{ __html: content }}
             />
         );
    }

    return (
        <div className={`prose prose-lg prose-indigo prose-img:rounded-2xl max-w-none ${className}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}

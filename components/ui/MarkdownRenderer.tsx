import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
    
    const isHtml = content.trim().startsWith('<') && (
        content.includes('</p>') || content.includes('</h1>') || content.includes('</h2>') || content.includes('</div>') || content.includes('</table>')
    );
    
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
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    pre({ children, ...props }) {
                        const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
                        if (child?.props?.className?.includes('language-svg')) {
                            return (
                                <div
                                    className="not-prose my-8"
                                    dangerouslySetInnerHTML={{ __html: String(child.props.children).trim() }}
                                />
                            );
                        }
                        return <pre {...props}>{children}</pre>;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

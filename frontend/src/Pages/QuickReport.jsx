import { useState } from 'react';
import '../Styles/QuickReports.css';

const QuickReports = () => {
  const [postUrl, setPostUrl] = useState('');
  const [postPreview, setPostPreview] = useState(null);
  const [urlError, setUrlError] = useState('');
  const [reported, setReported] = useState(false);

  const isValidUrl = (value) => {
    try {
      const u = new URL(value);
      return ['http:', 'https:'].includes(u.protocol) && !!u.hostname;
    } catch {
      return false;
    }
  };

  const analyzePostUrl = (url) => {
    setReported(false);
    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid URL (include https://)');
      setPostPreview(null);
      return;
    }
    setUrlError('');
    const u = new URL(url);
    const host = u.hostname.replace('www.', '').toLowerCase();
    let platform = 'Website';
    if (host.includes('facebook')) platform = 'Facebook';
    else if (host.includes('twitter') || host.includes('x.com')) platform = 'Twitter';
    else if (host.includes('instagram')) platform = 'Instagram';
    else if (host.includes('tiktok')) platform = 'TikTok';
    else if (host.includes('youtube') || host.includes('youtu.be')) platform = 'YouTube';

    const pathParts = u.pathname.split('/').filter(Boolean);
    const author = pathParts.length > 1 ? `@${pathParts[0]}` : '@unknown_user';
    const content = decodeURIComponent(pathParts.slice(-1)[0] || '').replace(/[-_]/g, ' ');

    // Mock analysis: tags + toxicity
    const tags = [];
    if (content.toLowerCase().includes('spam')) tags.push('spam');
    if (content.toLowerCase().includes('hate') || content.toLowerCase().includes('abuse')) tags.push('harassment');
    if (!tags.length) tags.push('no-obvious-issues');
    const toxicity = (Math.random() * 10).toFixed(1);

    setPostPreview({ platform, author, content: content || 'Preview not available', url: u.href, tags, toxicity, detectedAt: new Date().toLocaleString() });
  };

  const handleReportPost = () => {
    if (!postPreview) return;
    // For now keep it local/in-memory: mark reported and show confirmation.
    setReported(true);
  };

  return (
    <div className="QuickReports-page">
      <div className="QuickReports-container">
        <div className="reports quick-report-page">
          <div className="reports-container">
        <header className="reports-header">
          <h1>Quick Report</h1>
          <p>Paste a social post link to get an automatic breakdown and report it.</p>
        </header>

        <section className="post-analyzer">
          <label className="field-label">Post URL</label>
          <div className="analyzer-row">
            <input
              className="form-input"
              placeholder="https://..."
              value={postUrl}
              onChange={e => setPostUrl(e.target.value)}
              aria-label="Post URL"
            />
            <button className="btn btn-outline" onClick={() => analyzePostUrl(postUrl)}>Analyze</button>
            <button className="btn btn-primary" onClick={handleReportPost} disabled={!postPreview}>Report Post</button>
          </div>
          {urlError && <div className="url-error">{urlError}</div>}

          {postPreview && (
            <div className="post-preview">
              <div className="preview-header"><strong>{postPreview.platform}</strong> • {postPreview.author} • <span className="tiny-muted">{postPreview.detectedAt}</span></div>
              <div className="preview-content">{postPreview.content}</div>
              <div className="preview-meta">Tags: {postPreview.tags.join(', ')} • Toxicity: {postPreview.toxicity}</div>
              <div className="preview-actions"><a href={postPreview.url} target="_blank" rel="noreferrer" className="preview-link">Open Post</a></div>
              {reported && <div className="report-confirm">Post reported — thank you.</div>}
            </div>
          )}
        </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickReports;
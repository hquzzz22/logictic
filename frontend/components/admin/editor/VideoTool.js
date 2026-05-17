/**
 * VideoTool — Custom EditorJS block: upload video lên R2 hoặc embed YouTube/Vimeo
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default class VideoTool {
  static get toolbox() {
    return {
      title: 'Video',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>`,
    };
  }

  static get isReadOnlySupported() { return true; }

  constructor({ data, api, readOnly, config }) {
    this.data = data || {};
    this.api = api;
    this.readOnly = readOnly;
    this.token = config?.token || '';
    this._wrapper = null;
    this._state = data?.url ? 'done' : 'idle';
  }

  render() {
    this._wrapper = document.createElement('div');
    this._wrapper.style.cssText = 'margin:8px 0;border-radius:12px;overflow:hidden;';
    if (this._state === 'done' && this.data.url) this._renderPlayer();
    else this._renderPicker();
    return this._wrapper;
  }

  _renderPicker() {
    this._wrapper.innerHTML = '';
    this._wrapper.style.cssText = 'margin:8px 0;border-radius:12px;border:2px dashed #e2e8f0;background:#f8fafc;padding:28px;';
    const inner = document.createElement('div');
    inner.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;';
    inner.innerHTML = `
      <div style="width:52px;height:52px;border-radius:50%;background:#eff6ff;display:flex;align-items:center;justify-content:center;color:#3b82f6;">
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      </div>
      <div>
        <p style="font-weight:700;color:#1e293b;margin:0 0 4px;font-size:15px;">Thêm video vào bài viết</p>
        <p style="color:#94a3b8;font-size:13px;margin:0;">MP4, WebM, OGG · Tối đa 200MB</p>
      </div>
    `;
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.innerHTML = '⬆️ Tải video lên';
    uploadBtn.style.cssText = 'padding:10px 22px;background:#3b82f6;color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;';
    uploadBtn.onclick = () => this._fileInput?.click();
    const divider = document.createElement('div');
    divider.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;max-width:340px;';
    divider.innerHTML = `<div style="flex:1;height:1px;background:#e2e8f0;"></div><span style="color:#94a3b8;font-size:12px;">hoặc</span><div style="flex:1;height:1px;background:#e2e8f0;"></div>`;
    const urlWrap = document.createElement('div');
    urlWrap.style.cssText = 'display:flex;gap:8px;width:100%;max-width:380px;';
    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'Dán link YouTube, Vimeo hoặc URL video...';
    urlInput.style.cssText = 'flex:1;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;outline:none;';
    urlInput.onfocus = () => { urlInput.style.borderColor = '#3b82f6'; };
    urlInput.onblur = () => { urlInput.style.borderColor = '#e2e8f0'; };
    const urlBtn = document.createElement('button');
    urlBtn.type = 'button';
    urlBtn.textContent = 'Chèn';
    urlBtn.style.cssText = 'padding:9px 16px;background:#1e293b;color:white;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;';
    urlBtn.onclick = () => { const u = urlInput.value.trim(); if (u) this._handleUrl(u); };
    urlInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); urlBtn.click(); } };
    urlWrap.appendChild(urlInput);
    urlWrap.appendChild(urlBtn);
    inner.appendChild(uploadBtn);
    inner.appendChild(divider);
    inner.appendChild(urlWrap);
    this._wrapper.appendChild(inner);
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/mp4,video/webm,video/ogg,video/quicktime';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => { const f = e.target.files?.[0]; if (f) this._uploadFile(f); };
    this._fileInput = fileInput;
    this._wrapper.appendChild(fileInput);
  }

  _renderUploading(filename) {
    this._wrapper.innerHTML = '';
    this._wrapper.style.cssText = 'margin:8px 0;border-radius:12px;border:2px solid #dbeafe;background:#eff6ff;padding:20px;';
    this._wrapper.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:8px;background:#3b82f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          </div>
          <div style="flex:1;min-width:0;">
            <p style="font-weight:600;color:#1e293b;margin:0;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${filename}</p>
            <p style="color:#3b82f6;font-size:12px;margin:3px 0 0;" id="vt-status">Đang tải lên...</p>
          </div>
        </div>
        <div style="background:#bfdbfe;border-radius:999px;height:5px;overflow:hidden;">
          <div id="vt-bar" style="height:100%;background:#3b82f6;border-radius:999px;width:0%;transition:width 0.3s;"></div>
        </div>
        <p id="vt-pct" style="color:#3b82f6;font-size:12px;font-weight:600;margin:0;text-align:right;">0%</p>
      </div>
    `;
    this._barEl = this._wrapper.querySelector('#vt-bar');
    this._pctEl = this._wrapper.querySelector('#vt-pct');
  }

  _updateProgress(pct) {
    if (this._barEl) this._barEl.style.width = `${pct}%`;
    if (this._pctEl) this._pctEl.textContent = `${pct}%`;
  }

  async _uploadFile(file) {
    this._renderUploading(file.name);
    const formData = new FormData();
    formData.append('video', file);
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiUrl}/upload/video`);
      if (this.token) xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) this._updateProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.url) {
              this.data = { url: res.url, type: 'upload', caption: '' };
              this._state = 'done';
              this._renderPlayer();
              resolve();
              return;
            }
          } catch {}
        }
        this._renderError('Upload thất bại. Vui lòng thử lại.');
        resolve();
      };
      xhr.onerror = () => { this._renderError('Lỗi kết nối.'); resolve(); };
      xhr.send(formData);
    });
  }

  _handleUrl(url) {
    const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (youtube) this.data = { url, type: 'youtube', videoId: youtube[1], caption: '' };
    else if (vimeo) this.data = { url, type: 'vimeo', videoId: vimeo[1], caption: '' };
    else this.data = { url, type: 'url', caption: '' };
    this._state = 'done';
    this._renderPlayer();
  }

  _renderPlayer() {
    this._wrapper.innerHTML = '';
    this._wrapper.style.cssText = 'margin:8px 0;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;background:#0f172a;';
    const { url, type, caption, videoId } = this.data;
    const playerWrap = document.createElement('div');
    playerWrap.style.cssText = 'position:relative;aspect-ratio:16/9;width:100%;';
    if (type === 'youtube') {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      iframe.style.cssText = 'width:100%;height:100%;border:none;';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      playerWrap.appendChild(iframe);
    } else if (type === 'vimeo') {
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
      iframe.style.cssText = 'width:100%;height:100%;border:none;';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      playerWrap.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.style.cssText = 'width:100%;height:100%;background:#0f172a;object-fit:contain;';
      playerWrap.appendChild(video);
    }
    this._wrapper.appendChild(playerWrap);
    if (this.readOnly) return;
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;background:#1e293b;padding:8px 12px;';
    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.value = caption || '';
    captionInput.placeholder = 'Chú thích video (tuỳ chọn)...';
    captionInput.style.cssText = 'flex:1;background:transparent;border:none;color:#94a3b8;font-size:13px;outline:none;';
    captionInput.oninput = () => { this.data.caption = captionInput.value; };
    const replaceBtn = document.createElement('button');
    replaceBtn.type = 'button';
    replaceBtn.innerHTML = '🔄 Thay';
    replaceBtn.style.cssText = 'padding:4px 10px;background:#334155;color:#94a3b8;border:none;border-radius:6px;font-size:12px;cursor:pointer;';
    replaceBtn.onclick = () => { this.data = {}; this._state = 'idle'; this._renderPicker(); };
    footer.appendChild(captionInput);
    footer.appendChild(replaceBtn);
    this._wrapper.appendChild(footer);
  }

  _renderError(msg) {
    this._wrapper.innerHTML = `<div style="padding:16px;background:#fef2f2;border:2px solid #fecaca;border-radius:12px;text-align:center;"><p style="color:#ef4444;font-weight:600;margin:0 0 8px;">❌ ${msg}</p><button style="padding:6px 14px;background:#ef4444;color:white;border:none;border-radius:8px;font-size:13px;cursor:pointer;" onclick="this.closest('div')._vt.retry()">Thử lại</button></div>`;
    this._wrapper.querySelector('div')._vt = this;
    this._state = 'error';
  }

  retry() { this._renderPicker(); }
  save() { return this.data; }
  validate(data) { return !!data?.url; }
}

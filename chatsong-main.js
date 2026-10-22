(function() {
  'use strict';

  // --- 1. DYNAMISCHE STYLING INJECTEREN ---
  const style = document.createElement('style');
  style.innerHTML = `
    #music-chat-widget { position: fixed; bottom: 70px; right: 15px; left: 15px; width: auto; height: 420px; max-height: calc(100vh - 120px); background: #121318; border: 1px solid #2a2d3d; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); display: flex; flex-direction: column; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; transition: all 0.3s ease; }
    #music-chat-widget.minimized { height: 48px !important; left: auto; right: 15px; width: 220px; }
    #music-chat-widget.minimized #music-chat-messages, #music-chat-widget.minimized #music-chat-input-area, #music-chat-widget.minimized #chat-mention-dropdown { display: none !important; }
    #music-chat-header { background: #1a1c24; padding: 12px 16px; border-bottom: 1px solid #2a2d3d; display: flex; justify-content: space-between; align-items: center; color: #fff; font-weight: bold; font-size: 14px; cursor: pointer; user-select: none; }
    #music-chat-toggle { background: transparent; border: none; color: #00f0ff; font-size: 20px; font-weight: bold; cursor: pointer; line-height: 1; padding: 0 4px; }
    #music-chat-messages { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #0b0c10; -webkit-overflow-scrolling: touch; }
    .chat-msg { display: flex; gap: 10px; background: #181a22; padding: 10px; border-radius: 8px; font-size: 13px; position: relative; }
    .chat-avatar { width: 32px; height: 32px; border-radius: 50%; background: #00f0ff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; }
    .chat-body { display: flex; flex-direction: column; width: 100%; overflow-wrap: anywhere; }
    .chat-msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
    .chat-user { font-size: 11px; color: #00f0ff; font-weight: 600; }
    .chat-delete-btn { background: transparent; border: none; color: #ff5555; font-size: 13px; font-weight: bold; cursor: pointer; padding: 0 4px; opacity: 0.7; line-height: 1; }
    .chat-delete-btn:hover { color: #ff0000; }
    .chat-text { color: #e2e8f0; line-height: 1.4; }
    .chat-mention { color: #ff007f; font-weight: bold; background: rgba(255, 0, 127, 0.2); padding: 2px 6px; border-radius: 4px; }
    .chat-link { color: #00f0ff; text-decoration: underline; }
    .embed-container { margin-top: 8px; border-radius: 8px; overflow: hidden; width: 100%; }
    .embed-container iframe { display: block; border: none; width: 100% !important; }
    #music-chat-input-area { position: relative; padding: 10px; background: #1a1c24; border-top: 1px solid #2a2d3d; display: flex; gap: 8px; }
    #music-chat-input { flex: 1; background: #0b0c10; border: 1px solid #2a2d3d; color: #fff; padding: 8px 12px; border-radius: 6px; outline: none; font-size: 13px; }
    #music-chat-send { background: #00f0ff; color: #000; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    #chat-mention-dropdown { display: none; position: absolute; bottom: 58px; left: 10px; right: 10px; background: #1a1c24; border: 1px solid #00f0ff; border-radius: 8px; max-height: 140px; overflow-y: auto; z-index: 100000; box-shadow: 0 -4px 20px rgba(0,0,0,0.6); }
    .mention-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; color: #e2e8f0; font-size: 13px; border-bottom: 1px solid #2a2d3d; }
    .mention-item-avatar { width: 24px; height: 24px; border-radius: 50%; background: #00f0ff; color: #000; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; }
    .ForumActivity-table tr.ForumActivity-row.cs-collapsed-row { display: none !important; }
    .LeaderboardPage { padding: 15px; width: 100%; box-sizing: border-box; }
    .LeaderboardHero { background: linear-gradient(135deg, #8a2be2 0%, #ff007f 100%); color: #fff; padding: 20px 10px; border-radius: 12px; margin-bottom: 20px; text-align: center; }
    .LeaderboardHero .Hero-title { font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; margin: 0; color: #fff; }
    .LeaderboardPodium { display: flex; justify-content: center; align-items: flex-end; gap: 8px; margin-bottom: 25px; flex-wrap: nowrap; width: 100%; }
    .LeaderboardPodium-place { background: var(--body-bg, #fff); border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; padding: 12px 8px; text-align: center; flex: 1; min-width: 0; max-width: 160px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; }
    .LeaderboardPodium-place--1 { order: 2; transform: translateY(-6px); border-color: #ffd700; background: linear-gradient(to bottom, rgba(255,215,0,0.08), transparent); }
    .LeaderboardPodium-place--2 { order: 1; }
    .LeaderboardPodium-place--3 { order: 3; }
    .LeaderboardPodium-medal { font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 8px; margin-bottom: 6px; display: flex; align-items: center; gap: 3px; white-space: nowrap; }
    .LeaderboardPodium-medal--gold { background: #ffd700; color: #fff; }
    .LeaderboardPodium-medal--silver { background: #c0c0c0; color: #fff; }
    .LeaderboardPodium-medal--bronze { background: #cd7f32; color: #fff; }
    .LeaderboardPodium-avatar img, .LeaderboardContenders-avatar img, .LeaderboardItem-avatar img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-bottom: 6px; }
    .LeaderboardPodium-place--1 .LeaderboardPodium-avatar img { width: 50px; height: 50px; }
    .LeaderboardPodium-name, .LeaderboardContenders-name, .LeaderboardItem-name { font-weight: 700; font-size: 12px; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
    .LeaderboardPodium-points, .LeaderboardContenders-points, .LeaderboardItem-points { font-size: 10px; color: var(--primary-color, #8a2be2); font-weight: 600; }
    .LeaderboardContenders-title, .LeaderboardHonorable-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .LeaderboardContenders-grid, .LeaderboardHonorable-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; margin-bottom: 20px; }
    .LeaderboardContenders-card, .LeaderboardItem { background: var(--body-bg, #fff); border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit; box-sizing: border-box; }
    .LeaderboardContenders-rank, .LeaderboardItem-rank { font-weight: 700; font-size: 11px; color: #888; min-width: 18px; }
    .LeaderboardContenders-card .LeaderboardContenders-avatar img, .LeaderboardItem .LeaderboardItem-avatar img { width: 28px; height: 28px; margin-bottom: 0; }
  `;
  document.head.appendChild(style);

  // --- 2. CHAT WIDGET HTML INJECTEREN ---
  if (!document.getElementById('music-chat-widget')) {
    const chatWidgetDiv = document.createElement('div');
    chatWidgetDiv.id = 'music-chat-widget';
    chatWidgetDiv.innerHTML = `
      <div id="music-chat-header">
        <span>🎵 Live Music Room</span>
        <button id="music-chat-toggle" title="Toggle Chat">−</button>
      </div>
      <div id="music-chat-messages"></div>
      <div id="music-chat-input-area">
        <div id="chat-mention-dropdown"></div>
        <input type="text" id="music-chat-input" placeholder="Share track or type @user..." autocomplete="off" />
        <button id="music-chat-send">Send</button>
      </div>
    `;
    document.body.appendChild(chatWidgetDiv);
  }

  // --- 3. UNIVERSELE MEDIA EMBEDDERS ---
  function convertAllMediaLinks() {
    const containers = document.querySelectorAll('.Post-body, .PrivateMessage-body, .MessageBody, .item-content, .Comment');

    containers.forEach(container => {
      // SoundCloud
      const scElements = container.querySelectorAll('a[href*="soundcloud.com"], .LinkPreview a[href*="soundcloud.com"], iframe[src*="soundcloud.com"]');
      scElements.forEach(el => {
        let rawUrl = el.href || el.src;
        const targetBox = el.closest('.LinkPreview') || el.closest('iframe') || el;
        if (!rawUrl || targetBox.dataset.mediaDone) return;
        targetBox.dataset.mediaDone = "true";

        const iframe = document.createElement('iframe');
        iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(rawUrl)}&color=%238a2be2&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false`;
        iframe.style.cssText = 'width: 100%; max-width: 100%; height: 166px; border-radius: 12px; border: none; margin: 10px 0; background: transparent; display: block;';
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('frameborder', 'no');
        iframe.setAttribute('allow', 'autoplay');

        if (targetBox.parentNode) targetBox.parentNode.replaceChild(iframe, targetBox);
      });

      // YouTube Shorts
      const ytElements = container.querySelectorAll('a[href*="youtube.com/shorts/"], a[href*="youtu.be/"], .LinkPreview a[href*="youtube.com/shorts/"], .LinkPreview a[href*="youtu.be/"]');
      ytElements.forEach(link => {
        const targetBox = link.closest('.LinkPreview') || link;
        if (targetBox.dataset.mediaDone) return;

        let videoId = null;
        const href = link.href;
        if (href.includes('/shorts/')) {
          videoId = href.split('/shorts/')[1].split('?')[0].split('/')[0];
        } else if (href.includes('youtu.be/')) {
          videoId = href.split('youtu.be/')[1].split('?')[0].split('/')[0];
        }

        if (videoId) {
          targetBox.dataset.mediaDone = "true";
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.style.cssText = 'width: 100%; max-width: 340px; height: 580px; border-radius: 12px; border: none; margin: 10px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.15); display: block;';
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          iframe.setAttribute('allowfullscreen', 'true');

          if (targetBox.parentNode) targetBox.parentNode.replaceChild(iframe, targetBox);
        }
      });

      // TikTok
      const tiktokElements = container.querySelectorAll('a[href*="tiktok.com/"], .LinkPreview a[href*="tiktok.com/"]');
      tiktokElements.forEach(link => {
        const targetBox = link.closest('.LinkPreview') || link;
        if (targetBox.dataset.mediaDone) return;

        const matches = link.href.match(/video\/(\d+)/) || link.href.match(/\/v\/(\d+)/);
        if (matches && matches[1]) {
          targetBox.dataset.mediaDone = "true";
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.tiktok.com/embed/v2/${matches[1]}`;
          iframe.style.cssText = 'width: 100%; max-width: 325px; height: 580px; border-radius: 12px; border: none; margin: 10px 0; display: block;';

          if (targetBox.parentNode) targetBox.parentNode.replaceChild(iframe, targetBox);
        }
      });

      // Spotify
      const spotifyElements = container.querySelectorAll('a[href*="open.spotify.com/"], .LinkPreview a[href*="open.spotify.com/"]');
      spotifyElements.forEach(link => {
        const targetBox = link.closest('.LinkPreview') || link;
        if (targetBox.dataset.mediaDone) return;

        let url = link.href;
        if (url.includes('open.spotify.com/')) {
          targetBox.dataset.mediaDone = "true";
          let cleanUrl = url.split('?')[0];
          const embedUrl = cleanUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
          const frameHeight = embedUrl.includes('/concert/') || embedUrl.includes('/album/') || embedUrl.includes('/playlist/') ? '380px' : '152px';

          const iframe = document.createElement('iframe');
          iframe.src = embedUrl;
          iframe.style.cssText = `width: 100%; max-width: 100%; height: ${frameHeight}; border-radius: 12px; border: none; margin: 10px 0; display: block;`;
          iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
          iframe.setAttribute('loading', 'lazy');

          if (targetBox.parentNode) targetBox.parentNode.replaceChild(iframe, targetBox);
        }
      });
    });
  }

  // --- 4. INSTAGRAM STORY SHARE BUTTON ---
  function isUserTyping() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  function injectHeaderShareButton() {
    document.querySelectorAll('.Post-header > ul').forEach(ul => {
      if (!ul.querySelector('.item-cs-header-share')) {
        const li = document.createElement('li');
        li.className = 'item-cs-header-share';
        li.style.display = 'inline-flex';
        li.style.alignItems = 'center';
        li.style.marginTop = '4px';

        li.innerHTML = `
          <button class="Button cs-header-share-btn" type="button" title="Share to Instagram Story" style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045) !important; color: #fff !important; border: none !important; padding: 8px 14px !important; border-radius: 12px !important; font-size: 13px !important; font-weight: 700 !important; cursor: pointer !important; display: inline-flex !important; align-items: center !important; gap: 6px !important; box-shadow: 0 2px 6px rgba(225, 48, 108, 0.4) !important;">
            <i class="icon fab fa-instagram" style="font-size: 15px !important;"></i>
            <span class="Button-label" style="color: #fff !important; font-size: 13px !important; font-weight: 700 !important;">Share your topic</span>
          </button>
        `;
        ul.appendChild(li);

        li.querySelector('button').addEventListener('click', function(e) {
          e.preventDefault();
          generateAndShareIGStory(e.target.closest('.Post'));
        });
      }
    });
  }

  async function generateAndShareIGStory(postEl) {
    try {
      const title = document.querySelector('.DiscussionHero-title')?.innerText || document.title || 'Chatsong Track';
      const author = postEl ? (postEl.querySelector('.PostUser-name .username, .username')?.innerText || 'Indie Artist') : 'Indie Artist';
      const url = window.location.href;

      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
      grad.addColorStop(0, '#833ab4');
      grad.addColorStop(0.5, '#fd1d1d');
      grad.addColorStop(1, '#fcb045');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      ctx.fillStyle = '#ffffff';
      if (ctx.roundRect) { ctx.roundRect(80, 380, 920, 1160, 40); ctx.fill(); } else { ctx.fillRect(80, 380, 920, 1160); }

      ctx.font = '90px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎧', 540, 520);

      ctx.fillStyle = '#833ab4';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('CHATSONG.NL', 540, 600);

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 50px sans-serif';
      wrapText(ctx, title, 540, 710, 800, 65);

      ctx.fillStyle = '#e1306c';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('POSTED BY ' + author.toUpperCase(), 540, 1100);

      ctx.fillStyle = '#555555';
      ctx.font = '32px sans-serif';
      ctx.fillText('Luister & geef feedback op Chatsong', 540, 1420);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText('chatsong.nl', 540, 1720);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'chatsong-story.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: title, text: `Check this track on Chatsong: ${url}` });
        } else {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'chatsong-ig-story.png';
          a.click();
          alert('Instagram Story afbeelding gedownload!');
        }
      }, 'image/png');
    } catch (err) {}
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '', testY = y, linesCount = 0;
    for (let n = 0; n < words.length; n++) {
      if (linesCount >= 4) break;
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line, x, testY);
        line = words[n] + ' ';
        testY += lineHeight;
        linesCount++;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, testY);
  }

  // --- 5. A-Z FILTER BAR ---
  function injectAZBar() {
    if (!window.location.pathname.startsWith('/users')) {
      const existingBar = document.getElementById('cs-az-filter-bar');
      if (existingBar) existingBar.remove();
      return;
    }
    const resultsContainer = document.querySelector('.IndexPage-results');
    if (!resultsContainer || document.getElementById('cs-az-filter-bar')) return;

    const azBar = document.createElement('div');
    azBar.id = 'cs-az-filter-bar';
    azBar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 20px; padding: 10px; background: var(--body-bg, #f5f5f5); border-radius: 8px; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';

    const allBtn = document.createElement('button');
    allBtn.className = 'Button';
    allBtn.style.cssText = 'padding: 4px 8px; font-weight: bold; font-size: 11px; border-radius: 4px; cursor: pointer; background: #fff;';
    allBtn.innerText = 'Musicians';
    allBtn.onclick = function() {
      const searchInput = document.getElementById('user-directory-search');
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    azBar.appendChild(allBtn);

    const newJoinedBtn = document.createElement('button');
    newJoinedBtn.className = 'Button';
    newJoinedBtn.style.cssText = 'padding: 4px 8px; font-weight: bold; font-size: 11px; border-radius: 4px; cursor: pointer; background: #e7f5ff; color: #0066cc;';
    newJoinedBtn.innerText = '✨ New';
    newJoinedBtn.onclick = function() { window.location.href = '/users?sort=newest'; };
    azBar.appendChild(newJoinedBtn);

    const separator = document.createElement('span');
    separator.style.cssText = 'width: 1px; height: 20px; background: #ccc; margin: 0 2px;';
    azBar.appendChild(separator);

    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement('button');
      btn.className = 'Button';
      btn.style.cssText = 'min-width: 24px; height: 26px; padding: 0 4px; font-weight: bold; font-size: 12px; border-radius: 4px; cursor: pointer; text-align: center; background: #fff;';
      btn.innerText = letter;
      btn.onclick = function(e) {
        e.preventDefault();
        const searchInput = document.getElementById('user-directory-search');
        if (searchInput) {
          searchInput.value = letter;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      azBar.appendChild(btn);
    }
    resultsContainer.insertBefore(azBar, resultsContainer.firstChild);
  }

  // --- 6. STICKY ACCORDION ---
  function initStickyAccordion() {
    if (isUserTyping()) return;
    document.querySelectorAll('.ForumActivity-sectionHead').forEach(function(head) {
      if (head.dataset.accordionInit) return;
      const text = head.textContent || '';
      if (text.toLowerCase().includes('sticky')) {
        head.dataset.accordionInit = 'true';
        head.style.cursor = 'pointer';
        head.style.userSelect = 'none';

        let nextRows = [];
        let sibling = head.nextElementSibling;
        while (sibling && !sibling.classList.contains('ForumActivity-sectionHead')) {
          nextRows.push(sibling);
          sibling = sibling.nextElementSibling;
        }
        nextRows.forEach(row => row.style.display = 'none');

        if (!head.querySelector('.accordion-badge')) {
          const badge = document.createElement('span');
          badge.className = 'accordion-badge';
          badge.style.cssText = 'float: right; font-size: 11px; font-weight: bold; background: rgba(0, 0, 0, 0.2); padding: 3px 8px; border-radius: 4px; color: #fff; margin-top: -2px;';
          badge.textContent = '▶ Expand';
          head.appendChild(badge);
        }

        head.onclick = function() {
          const isHidden = nextRows[0] && nextRows[0].style.display === 'none';
          nextRows.forEach(row => row.style.display = isHidden ? '' : 'none');
          const badgeSpan = head.querySelector('.accordion-badge');
          if (badgeSpan) badgeSpan.textContent = isHidden ? '▼ Collapse' : '▶ Expand';
        };
      }
    });
  }

  // --- 7. PLYR VIDEOPLAYER ---
  function processVideos() {
    document.querySelectorAll('.Post-body').forEach(post => {
      post.querySelectorAll('.ButtonGroup, .fof-upload-download, div[data-fof-upload-download-uuid]').forEach(el => {
        if (el.dataset.plyrDone) return;
        const text = (el.innerText || el.textContent || '').toLowerCase();
        if (text.includes('.mp4')) {
          const linkTag = el.querySelector('a') || el.closest('a') || el.querySelector('.Button');
          let videoSrc = linkTag && linkTag.href ? linkTag.href : (el.getAttribute('data-fof-upload-download-uuid') ? window.location.origin + '/assets/files/' + el.getAttribute('data-fof-upload-download-uuid') : null);
          if (videoSrc) {
            el.dataset.plyrDone = "true";
            replaceWithPlyr(el.classList.contains('Button') && el.closest('.ButtonGroup') ? el.closest('.ButtonGroup') : el, videoSrc);
          }
        }
      });
      post.querySelectorAll('a[href*=".mp4"]').forEach(link => {
        if (link.dataset.plyrDone) return;
        link.dataset.plyrDone = "true";
        replaceWithPlyr(link, link.href);
      });
    });
  }

  function replaceWithPlyr(targetEl, videoSrc) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin: 14px 0; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.15);';
    const videoNode = document.createElement('video');
    videoNode.setAttribute('controls', '');
    videoNode.setAttribute('playsinline', '');
    videoNode.setAttribute('preload', 'auto');
    const sourceNode = document.createElement('source');
    sourceNode.src = videoSrc;
    sourceNode.type = 'video/mp4';
    videoNode.appendChild(sourceNode);
    wrapper.appendChild(videoNode);

    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.replaceChild(wrapper, targetEl);
      if (window.Plyr) new Plyr(videoNode, { controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'] });
    }
  }

  // --- 8. INITIALISATIE & MUTATION OBSERVER ---
  let timeout = null;
  const observer = new MutationObserver(() => {
    if (isUserTyping()) return;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      convertAllMediaLinks();
      injectHeaderShareButton();
      injectAZBar();
      initStickyAccordion();
      processVideos();
    }, 250);
  });

  if (document.body) observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('DOMContentLoaded', () => {
    convertAllMediaLinks();
    injectHeaderShareButton();
    injectAZBar();
    initStickyAccordion();
    processVideos();
  });
  window.addEventListener('flranet:page:changed', () => {
    setTimeout(() => {
      convertAllMediaLinks();
      injectHeaderShareButton();
      injectAZBar();
      initStickyAccordion();
      processVideos();
    }, 300);
  });
})();


<script>
(function() {
  'use strict';

  // Composer check voor mobiel
  function adjustChatForComposer() {
    var composer = document.querySelector('.Composer');
    var isComposerOpen = composer && (composer.classList.contains('active') || composer.clientHeight > 40 || !composer.classList.contains('closed'));
    if (isComposerOpen) {
      document.body.classList.add('composer-open');
    } else {
      document.body.classList.remove('composer-open');
    }
  }

  /* ==========================================================
     1. "SHARE YOUR TOPIC" BUTTON IN POST-HEADER & CANVAS
     ========================================================== */
  function injectHeaderShareButton() {
    document.querySelectorAll('.Post-header > ul').forEach(ul => {
      if (!ul.querySelector('.item-cs-header-share')) {
        const li = document.createElement('li');
        li.className = 'item-cs-header-share';
        li.style.display = 'inline-flex';
        li.style.alignItems = 'center';
        li.style.marginLeft = 'auto';

        li.innerHTML = `
          <button class="Button cs-header-share-btn" type="button" title="Share to Instagram Story" style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045) !important; color: #fff !important; border: none !important; padding: 6px 12px !important; border-radius: 12px !important; font-size: 13px !important; font-weight: 700 !important; cursor: pointer !important; display: inline-flex !important; align-items: center !important; gap: 6px !important; box-shadow: 0 2px 6px rgba(225, 48, 108, 0.4) !important;">
            <i class="icon fab fa-instagram" style="font-size: 15px !important;"></i>
            <span class="Button-label" style="color: #fff !important; font-size: 13px !important; font-weight: 700 !important;">Share your topic</span>
          </button>
        `;

        ul.appendChild(li);

        li.querySelector('button').addEventListener('click', function(e) {
          e.preventDefault();
          const postEl = e.target.closest('.Post');
          generateAndShareIGStory(postEl);
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
      if (ctx.roundRect) {
        ctx.roundRect(80, 380, 920, 1160, 40);
        ctx.fill();
      } else {
        ctx.fillRect(80, 380, 920, 1160);
      }

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
          await navigator.share({
            files: [file],
            title: title,
            text: `Check this track on Chatsong: ${url}`
          });
        } else {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'chatsong-ig-story.png';
          a.click();
          alert('Instagram Story afbeelding gedownload!');
        }
      }, 'image/png');

    } catch (err) {
      console.error(err);
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testY = y;
    let linesCount = 0;

    for (let n = 0; n < words.length; n++) {
      if (linesCount >= 4) break;
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
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

  /* ==========================================================
     2. CONTINU BLYVEN CONTROLEREN (SPA OBSERVER)
     ========================================================== */
  function runAllInjections() {
    adjustChatForComposer();
    injectHeaderShareButton();
  }

  // Luister naar Flarum pagina-wissels
  const observer = new MutationObserver(runAllInjections);
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', runAllInjections);
})();
</script>

<script>
(function() {
  function injectStagingButtons() {
    // Zoek naar de container van de blogposts of de overzichtspagina
    const container = document.querySelector('.FlarumBlog-OverviewPage') || 
                      document.querySelector('.BlogOverviewPage') ||
                      document.querySelector('.FlarumBlog-Posts');

    if (!container || document.querySelector('.cs-blog-guest-nav')) return;

    const navDiv = document.createElement('div');
    navDiv.className = 'cs-blog-guest-nav';
    navDiv.style.cssText = 'display:flex; gap:8px; overflow-x:auto; margin:15px 0; padding:5px 0;';
    
    // Voeg dynamisch het juiste domein toe (werkt op staging én live)
    const baseUrl = window.location.origin;

    navDiv.innerHTML = `
      <a href="${baseUrl}/blog/1642-mysterieus-hidden-gem-drop" class="Button cs-nav-btn cs-btn-gem">💎 Hidden Gem</a>
      <a href="${baseUrl}/blog/1548-submit-a-hidden-gem" class="Button cs-nav-btn cs-btn-submit">📥 Submit Gem</a>
      <a href="${baseUrl}/blog/1486-beta-the-rising-tracks-showcase-submit-your-music" class="Button cs-nav-btn cs-btn-rising">🚀 Rising Tracks</a>
      <a href="${baseUrl}/blog/1359-weekly-chart-voting-renews-every-week-test-demo" class="Button cs-nav-btn cs-btn-chart">📊 Weekly Chart</a>
    `;

    container.prepend(navDiv);
  }

  const observer = new MutationObserver(injectStagingButtons);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', injectStagingButtons);
})();
</script>



<script>
/* ==========================================================
   REDDIT-STYLE PAGINATION FOR FORUM ACTIVITY (STAGING)
   ========================================================== */
function initActivityPagination() {
  const container = document.querySelector('.ForumActivity-list') || document.querySelector('.ForumActivity-table tbody') || document.querySelector('.ForumActivity');
  if (!container) return;

  const rows = Array.from(container.querySelectorAll('.ForumActivity-row'));
  if (rows.length <= 5) {
    const existingNav = document.querySelector('.cs-reddit-pagination');
    if (existingNav) existingNav.remove();
    rows.forEach(row => row.style.display = '');
    return;
  }

  if (container.dataset.paginatedCount == rows.length) return;
  container.dataset.paginatedCount = rows.length;

  let currentPage = 1;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  function showPage(page) {
    rows.forEach((row, index) => {
      row.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) ? '' : 'none';
    });
    if (pageInfo) pageInfo.innerText = `Pagina ${page} van ${totalPages}`;
    if (prevBtn) prevBtn.disabled = (page === 1);
    if (nextBtn) nextBtn.disabled = (page === totalPages);
  }

  const oldNav = container.parentNode.querySelector('.cs-reddit-pagination');
  if (oldNav) oldNav.remove();

  const navContainer = document.createElement('div');
  navContainer.className = 'cs-reddit-pagination';
  navContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin-top: 10px; background: rgba(0,0,0,0.15); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px;';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'Button';
  prevBtn.innerText = '← Vorige';
  prevBtn.style.cssText = 'padding: 6px 14px; font-size: 11px; font-weight: bold; border-radius: 6px; cursor: pointer; background: var(--button-bg, #2a2a2a); color: inherit; border: 1px solid rgba(255,255,255,0.1);';
  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; showPage(currentPage); } };

  const pageInfo = document.createElement('span');
  pageInfo.style.cssText = 'opacity: 0.8; font-weight: 600; letter-spacing: 0.5px;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'Button';
  nextBtn.innerText = 'Volgende →';
  nextBtn.style.cssText = 'padding: 6px 14px; font-size: 11px; font-weight: bold; border-radius: 6px; cursor: pointer; background: var(--button-bg, #2a2a2a); color: inherit; border: 1px solid rgba(255,255,255,0.1);';
  nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; showPage(currentPage); } };

  navContainer.appendChild(prevBtn);
  navContainer.appendChild(pageInfo);
  navContainer.appendChild(nextBtn);

  container.parentNode.appendChild(navContainer);
  showPage(1);
}

// Direct aanroepen of in je centrale loop hangen
document.addEventListener('DOMContentLoaded', initActivityPagination);
setTimeout(initActivityPagination, 1000);
</script>



<script>
document.addEventListener('DOMContentLoaded', function() {
  const observer = new MutationObserver(function() {
    // Zoek alle bekende mobiele share-links in berichten
    const selector = '.Post-body a[href*="on.soundcloud.com"], .Post-body a[href*="youtube.com/shorts/"], .Post-body a[href*="youtu.be/"]';
    const mobileLinks = document.querySelectorAll(selector);

    mobileLinks.forEach(function(link) {
      if (link.dataset.embedded) return;
      link.dataset.embedded = "true";

      const url = link.href;

      // 1. YouTube Shorts & Shortlinks
      if (url.includes('youtube.com/shorts/') || url.includes('youtu.be/')) {
        let videoId = '';
        if (url.includes('youtube.com/shorts/')) {
          videoId = url.split('shorts/')[1].split('?')[0];
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        if (videoId) {
          const iframe = document.createElement('iframe');
          iframe.width = '100%';
          iframe.height = '450';
          iframe.src = 'https://www.youtube.com/embed/' + videoId;
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.style.borderRadius = '12px';
          iframe.style.marginTop = '10px';
          
          link.parentNode.replaceChild(iframe, link);
        }
      }

      // 2. SoundCloud Mobile Links via OEmbed API
      if (url.includes('on.soundcloud.com')) {
        fetch('https://soundcloud.com/oembed?format=json&url=' + encodeURIComponent(url))
          .then(res => res.json())
          .then(data => {
            if (data && data.html) {
              const div = document.createElement('div');
              div.className = 'cs-soundcloud-embed';
              div.style.marginTop = '10px';
              div.innerHTML = data.html;
              link.parentNode.replaceChild(div, link);
            }
          })
          .catch(err => console.error('SoundCloud embed error:', err));
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
</script>


<script src="https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js"></script>

<style>
/* Standaard verborgen op desktop, alleen tonen op mobiel */
#chatsong-direct-mic {
    display: none !important;
}

@media (max-width: 767px) {
    #chatsong-direct-mic {
        display: inline-flex !important;
        align-items: center;
        flex-shrink: 0;
        margin-right: 2px;
    }
    #chatsong-direct-mic button {
        padding: 6px 8px !important;
        min-height: 32px;
        min-width: 32px;
    }
    #chatsong-direct-mic .Button-label {
        display: none !important;
    }
    #chatsong-direct-mic.is-recording .Button-label {
        display: inline-block !important;
        font-size: 10px !important;
        margin-left: 2px !important;
        font-weight: bold;
    }
    .TextEditor-controls {
        display: flex !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        padding-left: 4px !important;
    }
}

/* Stijl voor de melding met het juiste Flarum upload-icoon */
#chatsong-toast {
    position: fixed;
    bottom: 75px;
    left: 50%;
    transform: translateX(-50%);
    background: #181820;
    color: #f3f4f6;
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-family: -apple-system, sans-serif;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    border: 1px solid rgba(124, 58, 237, 0.4);
    z-index: 99999;
    text-align: center;
    display: none;
    max-width: 90%;
}
#chatsong-toast i {
    color: #7c3aed;
    margin: 0 3px;
}
</style>

<!-- Meldingselement -->
<div id="chatsong-toast"></div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    let audioContext, mediaStream, processor;
    let leftChannel = [], sampleRate = 44100;
    let timerInterval, seconds = 0;
    let isRecording = false;

    // Detecteer taal voor de melding
    const userLang = navigator.language || navigator.userLanguage;
    const isDutch = userLang.startsWith('nl');

    const translations = {
        nl: {
            toast: '📥 Voicenote opgeslagen! Tik op dit icoon <i class="icon fas fa-file-upload"></i> om hem toe te voegen.',
            error: "Microfoon toegang geweigerd of niet beschikbaar."
        },
        en: {
            toast: '📥 Voice note saved! Tap this icon <i class="icon fas fa-file-upload"></i> to add it.',
            error: "Microphone access denied or unavailable."
        }
    };

    const currentText = isDutch ? translations.nl : translations.en;

    setInterval(() => {
        const toolbar = document.querySelector('.TextEditor-controls');
        if (toolbar && !document.getElementById('chatsong-direct-mic') && !isRecording) {
            const li = document.createElement('li');
            li.id = 'chatsong-direct-mic';
            li.innerHTML = `
                <button class="Button Button--icon Button--link hasIcon" type="button" id="micRecordBtn" title="Record Voice Note">
                    <i aria-hidden="true" class="icon fas fa-microphone Button-icon" id="micIcon" style="color: #7c3aed; font-size: 15px;"></i>
                    <span class="Button-label" id="micLabel">Voice</span>
                </button>
            `;
            
            toolbar.insertBefore(li, toolbar.firstChild);

            const micBtn = document.getElementById('micRecordBtn');
            const micIcon = document.getElementById('micIcon');
            const micLabel = document.getElementById('micLabel');
            const micContainer = document.getElementById('chatsong-direct-mic');

            micBtn.onclick = async () => {
                if (!isRecording) {
                    // START OPNAMEN
                    leftChannel = [];
                    try {
                        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        if (audioContext.state === 'suspended') await audioContext.resume();
                        sampleRate = audioContext.sampleRate;

                        const source = audioContext.createMediaStreamSource(mediaStream);
                        processor = audioContext.createScriptProcessor(4096, 1, 1);

                        processor.onaudioprocess = (e) => {
                            const channelData = e.inputBuffer.getChannelData(0);
                            const pcm = new Int16Array(channelData.length);
                            for (let i = 0; i < channelData.length; i++) {
                                let s = Math.max(-1, Math.min(1, channelData[i]));
                                pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                            }
                            leftChannel.push(pcm);
                        };

                        source.connect(processor);
                        processor.connect(audioContext.destination);

                        isRecording = true;
                        micContainer.classList.add('is-recording');
                        micIcon.className = "icon fas fa-stop-circle Button-icon";
                        micIcon.style.color = "#ef4444";
                        
                        seconds = 0;
                        micLabel.textContent = "00:00";
                        timerInterval = setInterval(() => {
                            seconds++;
                            const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
                            const secs = String(seconds % 60).padStart(2, '0');
                            micLabel.textContent = `${mins}:${secs}`;
                        }, 1000);

                    } catch (err) {
                        alert(currentText.error);
                        console.error(err);
                    }
                } else {
                    // STOP OPNAMEN EN DOWNLOAD MP3
                    if (processor) processor.disconnect();
                    if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
                    
                    clearInterval(timerInterval);

                    const mp3Blob = encodeMp3(leftChannel, sampleRate);
                    const url = URL.createObjectURL(mp3Blob);

                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `chatsong-voicenote-${Date.now()}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    if (audioContext && audioContext.state !== 'closed') audioContext.close();

                    isRecording = false;
                    micContainer.classList.remove('is-recording');
                    micIcon.className = "icon fas fa-microphone Button-icon";
                    micIcon.style.color = "#7c3aed";
                    micLabel.textContent = "Voice";

                    // Toon de melding met het juiste upload-icoon erin
                    const toast = document.getElementById('chatsong-toast');
                    toast.innerHTML = currentText.toast;
                    toast.style.display = 'block';
                    setTimeout(() => {
                        toast.style.display = 'none';
                    }, 6000);
                }
            };
        }
    }, 300);

    function encodeMp3(chunks, sampleRate) {
        if (typeof lamejs === 'undefined') return new Blob([], { type: 'audio/mp3' });
        const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
        const mp3Data = [];
        for (let i = 0; i < chunks.length; i++) {
            const mp3buf = mp3encoder.encodeBuffer(chunks[i]);
            if (mp3buf.length > 0) mp3Data.push(mp3buf);
        }
        const mp3buf = mp3encoder.flush();
        if (mp3buf.length > 0) mp3Data.push(mp3buf);
        return new Blob(mp3Data, { type: 'audio/mp3' });
    }
});
</script>

<!-- Plyr CSS & JS inladen via officiële CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.css" />
<script src="https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.polyfilled.js"></script>

<script>
(function() {
  function processVideos() {
    const posts = document.querySelectorAll('.Post-body');

    posts.forEach(post => {
      // 1. Zoek naar alle FoF upload knoppen/links met een download URL
      const fofElements = post.querySelectorAll('.ButtonGroup, .fof-upload-download, div[data-fof-upload-download-uuid]');

      fofElements.forEach(el => {
        if (el.dataset.plyrDone) return;

        const text = (el.innerText || el.textContent || '').toLowerCase();
        if (text.includes('.mp4')) {
          // Zoek het <a> tagje op dat FoF Upload heeft gegenereerd
          const linkTag = el.querySelector('a') || el.closest('a') || el.querySelector('.Button');
          let videoSrc = null;

          if (linkTag && linkTag.href) {
            videoSrc = linkTag.href;
          } else {
            // Als er geen direct a-tag is, pakken we de 'data-fof-upload-download-uuid'
            const uuid = el.getAttribute('data-fof-upload-download-uuid');
            if (uuid) {
              videoSrc = window.location.origin + '/assets/files/' + uuid;
            }
          }

          if (videoSrc) {
            el.dataset.plyrDone = "true";
            replaceWithPlyr(el, videoSrc);
          }
        }
      });

      // 2. Zoek naar gewone direct geplakte .mp4 links in berichten
      const links = post.querySelectorAll('a[href*=".mp4"]');
      links.forEach(link => {
        if (link.dataset.plyrDone) return;
        link.dataset.plyrDone = "true";
        replaceWithPlyr(link, link.href);
      });
    });
  }

  function replaceWithPlyr(targetEl, videoSrc) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chatsong-video-wrapper';
    wrapper.style.cssText = 'margin: 14px 0; border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.15);';

    const videoNode = document.createElement('video');
    videoNode.className = 'cs-plyr';
    videoNode.setAttribute('controls', '');
    videoNode.setAttribute('playsinline', '');
    videoNode.setAttribute('preload', 'auto');

    const sourceNode = document.createElement('source');
    sourceNode.src = videoSrc;
    sourceNode.type = 'video/mp4';

    videoNode.appendChild(sourceNode);
    wrapper.appendChild(videoNode);

    // Pak de hele knoppengroep om te vervangen
    let elementToReplace = targetEl;
    if (targetEl.classList.contains('Button') && targetEl.closest('.ButtonGroup')) {
      elementToReplace = targetEl.closest('.ButtonGroup');
    }

    if (elementToReplace && elementToReplace.parentNode) {
      elementToReplace.parentNode.replaceChild(wrapper, elementToReplace);

      // Activeer Plyr op de video
      if (window.Plyr) {
        new Plyr(videoNode, {
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', processVideos);

  const observer = new MutationObserver(processVideos);
  window.addEventListener('load', () => {
    const target = document.getElementById('app') || document.getElementById('content');
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  });
})();
</script>


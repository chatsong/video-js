<!-- ==========================================================
     1. UNIVERSELE MEDIA EMBEDDERS (SoundCloud, YT Shorts, TikTok, Spotify)
        - MOET BOVENAAN STAAN ZODAT SPELERS ALS EERSTE LADEN
     ========================================================== -->
<script>
(function() {
  'use strict';

  function convertAllMediaLinks() {
    const containers = document.querySelectorAll('.Post-body, .PrivateMessage-body, .MessageBody, .item-content, .Comment');

    containers.forEach(container => {
      
      // --- A. SOUNDCLOUD FIX ---
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

        if (targetBox.parentNode) {
          targetBox.parentNode.replaceChild(iframe, targetBox);
        }
      });

      // --- B. YOUTUBE SHORTS ---
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

          if (targetBox.parentNode) {
            targetBox.parentNode.replaceChild(iframe, targetBox);
          }
        }
      });

      // --- C. TIKTOK ---
      const tiktokElements = container.querySelectorAll('a[href*="tiktok.com/"], .LinkPreview a[href*="tiktok.com/"]');
      tiktokElements.forEach(link => {
        const targetBox = link.closest('.LinkPreview') || link;
        if (targetBox.dataset.mediaDone) return;

        const matches = link.href.match(/video\/(\d+)/) || link.href.match(/\/v\/(\d+)/);
        if (matches && matches[1]) {
          const videoId = matches[1];
          targetBox.dataset.mediaDone = "true";

          const iframe = document.createElement('iframe');
          iframe.src = `https://www.tiktok.com/embed/v2/${videoId}`;
          iframe.style.cssText = 'width: 100%; max-width: 325px; height: 580px; border-radius: 12px; border: none; margin: 10px 0; display: block;';

          if (targetBox.parentNode) {
            targetBox.parentNode.replaceChild(iframe, targetBox);
          }
        }
      });

      // --- D. SPOTIFY ---
      const spotifyElements = container.querySelectorAll('a[href*="open.spotify.com/"], .LinkPreview a[href*="open.spotify.com/"]');
      spotifyElements.forEach(link => {
        const targetBox = link.closest('.LinkPreview') || link;
        if (targetBox.dataset.mediaDone) return;

        let url = link.href;
        if (url.includes('open.spotify.com/')) {
          targetBox.dataset.mediaDone = "true";
          
          let cleanUrl = url.split('?')[0];
          const embedUrl = cleanUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');

          const iframe = document.createElement('iframe');
          iframe.src = embedUrl;
          const frameHeight = embedUrl.includes('/concert/') || embedUrl.includes('/album/') || embedUrl.includes('/playlist/') ? '380px' : '152px';
          
          iframe.style.cssText = `width: 100%; max-width: 100%; height: ${frameHeight}; border-radius: 12px; border: none; margin: 10px 0; display: block;`;
          iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
          iframe.setAttribute('loading', 'lazy');

          if (targetBox.parentNode) {
            targetBox.parentNode.replaceChild(iframe, targetBox);
          }
        }
      });

    });
  }

  document.addEventListener('DOMContentLoaded', convertAllMediaLinks);
  window.addEventListener('flarum:page:changed', convertAllMediaLinks);

  const observer = new MutationObserver(convertAllMediaLinks);
  window.addEventListener('load', () => {
    const target = document.getElementById('app') || document.body;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  });
})();
</script>


<!-- ==========================================================
     2. INSTAGRAM STORY SHARE BUTTON
     ========================================================== -->
<script>
(function() {
  'use strict';

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
      const metrics = ctx.measureTest(testLine);
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

  injectHeaderShareButton();
  const observer = new MutationObserver(injectHeaderShareButton);
  observer.observe(document.body, { childList: true, subtree: true });
})();
</script>


<!-- ==========================================================
     3. A-Z FILTER BAR & STICKY ACCORDION
     ========================================================== -->
<script>
(function() {
  'use strict';

  function isUserTyping() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  function injectAZBar() {
    if (!window.location.pathname.startsWith('/users')) {
      var existingBar = document.getElementById('cs-az-filter-bar');
      if (existingBar) existingBar.remove();
      return;
    }

    var resultsContainer = document.querySelector('.IndexPage-results');
    if (!resultsContainer || document.getElementById('cs-az-filter-bar')) return;

    var azBar = document.createElement('div');
    azBar.id = 'cs-az-filter-bar';
    azBar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 20px; padding: 10px; background: var(--body-bg, #f5f5f5); border-radius: 8px; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';

    var allBtn = document.createElement('button');
    allBtn.className = 'Button';
    allBtn.style.cssText = 'padding: 4px 8px; font-weight: bold; font-size: 11px; border-radius: 4px; cursor: pointer; background: #fff;';
    allBtn.innerText = 'Musicians';
    allBtn.onclick = function() {
      var searchInput = document.getElementById('user-directory-search');
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    azBar.appendChild(allBtn);

    var newJoinedBtn = document.createElement('button');
    newJoinedBtn.className = 'Button';
    newJoinedBtn.style.cssText = 'padding: 4px 8px; font-weight: bold; font-size: 11px; border-radius: 4px; cursor: pointer; background: #e7f5ff; color: #0066cc;';
    newJoinedBtn.innerText = '✨ New';
    newJoinedBtn.onclick = function() {
      window.location.href = '/users?sort=newest';
    };
    azBar.appendChild(newJoinedBtn);

    var separator = document.createElement('span');
    separator.style.cssText = 'width: 1px; height: 20px; background: #ccc; margin: 0 2px;';
    azBar.appendChild(separator);

    for (var i = 65; i <= 90; i++) {
      var letter = String.fromCharCode(i);
      var btn = document.createElement('button');
      btn.className = 'Button';
      btn.style.cssText = 'min-width: 24px; height: 26px; padding: 0 4px; font-weight: bold; font-size: 12px; border-radius: 4px; cursor: pointer; text-align: center; background: #fff;';
      btn.innerText = letter;
      
      (function(l) {
        btn.onclick = function(e) {
          e.preventDefault();
          var searchInput = document.getElementById('user-directory-search');
          if (searchInput) {
            searchInput.value = l;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };
      })(letter);

      azBar.appendChild(btn);
    }

    resultsContainer.insertBefore(azBar, resultsContainer.firstChild);
  }

  function initStickyAccordion() {
    if (isUserTyping()) return;

    var heads = document.querySelectorAll('.ForumActivity-sectionHead');
    heads.forEach(function(head) {
      if (head.dataset.accordionInit) return;
      var text = head.textContent || '';
      if (text.toLowerCase().includes('sticky')) {
        head.dataset.accordionInit = 'true';
        head.style.cursor = 'pointer';
        head.style.userSelect = 'none';
        
        var nextRows = [];
        var sibling = head.nextElementSibling;
        while (sibling && !sibling.classList.contains('ForumActivity-sectionHead')) {
          nextRows.push(sibling);
          sibling = sibling.nextElementSibling;
        }
        
        nextRows.forEach(function(row) {
          row.style.display = 'none';
        });
        
        if (!head.querySelector('.accordion-badge')) {
          var badge = document.createElement('span');
          badge.className = 'accordion-badge';
          badge.style.cssText = 'float: right; font-size: 11px; font-weight: bold; background: rgba(0, 0, 0, 0.2); padding: 3px 8px; border-radius: 4px; color: #fff; margin-top: -2px;';
          badge.textContent = '▶ Expand';
          head.appendChild(badge);
        }
        
        head.onclick = function() {
          var isHidden = nextRows[0] && nextRows[0].style.display === 'none';
          nextRows.forEach(function(row) {
            row.style.display = isHidden ? '' : 'none';
          });
          
          var badgeSpan = head.querySelector('.accordion-badge');
          if (badgeSpan) {
            badgeSpan.textContent = isHidden ? '▼ Collapse' : '▶ Expand';
          }
        };
      }
    });
  }

  let timeout = null;
  const observer = new MutationObserver(function() {
    if (isUserTyping()) return;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      injectAZBar();
      initStickyAccordion();
    }, 250);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('DOMContentLoaded', () => {
    injectAZBar();
    initStickyAccordion();
  });
})();
</script>

<style>
  .ForumActivity-table tr.ForumActivity-row.cs-collapsed-row {
    display: none !important;
  }
</style>

<script>
(function() {
    'use strict';
    
    function initSticky() {
        document.querySelectorAll('.ForumActivity-sectionHead').forEach(function(head) {
            var text = head.textContent || '';
            if (!text.toLowerCase().includes('sticky')) return;
            
            head.style.cursor = 'pointer';
            head.style.userSelect = 'none';
            
            if (!head.querySelector('.accordion-badge')) {
                var badge = document.createElement('span');
                badge.className = 'accordion-badge';
                badge.style.cssFloat = 'right';
                badge.style.fontSize = '11px';
                badge.style.fontWeight = 'bold';
                badge.style.background = 'rgba(0, 0, 0, 0.2)';
                badge.style.padding = '3px 8px';
                badge.style.borderRadius = '4px';
                badge.style.color = 'rgb(255, 255, 255)';
                badge.style.marginTop = '-2px';
                badge.style.marginRight = '8px';
                badge.innerHTML = '▼ Collapse';
                
                var cell = head.querySelector('td') || head;
                cell.appendChild(badge);
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        var head = e.target.closest('.ForumActivity-sectionHead');
        if (!head) return;
        
        var text = head.textContent || '';
        if (!text.toLowerCase().includes('sticky')) return;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        var isCollapsed = head.classList.toggle('cs-collapsed');
        var badge = head.querySelector('.accordion-badge');
        if (badge) {
            if (isCollapsed) {
                badge.innerHTML = '▶ Expand';
            } else {
                badge.innerHTML = '▼ Collapse';
            }
        }
        
        var next = head.nextElementSibling;
        while (next && !next.classList.contains('ForumActivity-sectionHead')) {
            if (next.tagName === 'TR') {
                if (isCollapsed) {
                    next.classList.add('cs-collapsed-row');
                } else {
                    next.classList.remove('cs-collapsed-row');
                }
            }
            next = next.nextElementSibling;
        }
    }, true);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSticky);
    } else {
        initSticky();
    }
    
    var observer = new MutationObserver(function() {
        initSticky();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
</script>


<!-- ==========================================================
     4. UNIVERSELE SOCIAL & PRE-SAVE CARD FIXER
     ========================================================== -->
<script>
(function() {
  'use strict';

  function cleanUrl(url) {
    if (!url) return '';
    return url.split('?')[0].replace(/\/$/, '').toLowerCase();
  }

  function detectPlatform(url) {
    var lower = url.toLowerCase();
    if (lower.includes('distrokid.com') || lower.includes('hyperfollow')) return 'distrokid';
    if (lower.includes('ffm.to') || lower.includes('feature.fm') || lower.includes('toneden.io') || lower.includes('smarturl') || lower.includes('show.co') || lower.includes('ditto.fm') || lower.includes('presave')) return 'presave';
    if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
    if (lower.includes('linktr.ee') || lower.includes('beacons.ai') || lower.includes('bio.link')) return 'linktree';
    return 'generic';
  }

  function createPlatformCard(url, type) {
    var rawClean = url.split('?')[0].replace(/\/$/, '');
    var parts = rawClean.split('/');
    var identifier = parts[parts.length - 1] || 'Release';

    var config = {
      distrokid: { bg: 'linear-gradient(135deg, #00C6FF, #0072FF)', icon: 'fas fa-compact-disc', title: 'DistroKid / HyperFollow', sub: 'Pre-save or stream release' },
      presave: { bg: 'linear-gradient(135deg, #8E2DE2, #4A00E0)', icon: 'fas fa-music', title: 'Pre-Save / Smart Link', sub: 'Pre-save or choose music platform' },
      instagram: { bg: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)', icon: 'fab fa-instagram', title: 'Instagram', sub: 'View profile on Instagram' },
      linktree: { bg: 'linear-gradient(135deg, #39E09B, #1E293B)', icon: 'fas fa-tree', title: 'Linktree / Bio', sub: 'View creator links' },
      generic: { bg: 'rgba(255,255,255,0.08)', icon: 'fas fa-external-link-alt', title: 'External Link', sub: rawClean }
    };

    var item = config[type] || config.generic;
    var displayTitle = (type !== 'generic') ? (item.title + ': ' + identifier) : item.title;

    var card = document.createElement('div');
    card.className = 'cs-card-box';
    card.style.cssText = 'display: flex; align-items: center; background: ' + item.bg + '; border-radius: 8px; padding: 10px 14px; margin: 8px 0; color: #ffffff; max-width: 480px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1);';
    card.innerHTML = `
      <div style="font-size: 22px; margin-right: 12px; display: flex; align-items: center; color: #fff; min-width: 26px; justify-content: center;">
        <i class="${item.icon}"></i>
      </div>
      <div style="flex: 1; overflow: hidden;">
        <div style="font-weight: 700; font-size: 13px; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${displayTitle}</div>
        <div style="font-size: 11px; color: rgba(255,255,255,0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.sub}</div>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #fff; margin-left: 8px; white-space: nowrap;">Open</div>
    `;

    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.textDecoration = 'none';
    anchor.className = 'cs-custom-card';
    anchor.appendChild(card);

    return anchor;
  }

  function processPostBodies() {
    var postBodies = document.querySelectorAll('.Post-body');

    postBodies.forEach(function(body) {
      var handledUrls = [];

      var existingCards = body.querySelectorAll('a.cs-custom-card');
      existingCards.forEach(function(cardA) {
        var cUrl = cleanUrl(cardA.href);
        if (handledUrls.indexOf(cUrl) !== -1) {
          cardA.remove();
        } else {
          handledUrls.push(cUrl);
        }
      });

      var previews = body.querySelectorAll('.LinkPreview');
      previews.forEach(function(preview) {
        if (preview.dataset.mediaDone || preview.querySelector('iframe')) return;

        var link = preview.closest('a') || preview.querySelector('a') || preview.parentElement;
        var rawUrl = link ? (link.href || '') : '';
        if (!rawUrl) return;

        var cUrl = cleanUrl(rawUrl);
        var platform = detectPlatform(rawUrl);
        var targetToReplace = preview.closest('a') || preview;

        if (platform !== 'generic') {
          if (handledUrls.indexOf(cUrl) !== -1) {
            targetToReplace.remove();
          } else {
            var newCard = createPlatformCard(rawUrl, platform);
            handledUrls.push(cUrl);
            if (targetToReplace && targetToReplace.parentNode) {
              targetToReplace.parentNode.replaceChild(newCard, targetToReplace);
            }
          }
        }
      });
    });
  }

  window.addEventListener('flarum:page:changed', function() {
    setTimeout(processPostBodies, 300);
  });

  var observer = new MutationObserver(processPostBodies);
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
</script>


<!-- ==========================================================
     5. PLYR MP4 VIDEOSPELER & LIVE MUSIC CHATROOM & LEADERBOARD
     ========================================================== -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.css" />
<script src="https://cdn.jsdelivr.net/npm/plyr@3.7.8/dist/plyr.polyfilled.js"></script>

<script>
(function() {
  function processVideos() {
    const posts = document.querySelectorAll('.Post-body');

    posts.forEach(post => {
      const fofElements = post.querySelectorAll('.ButtonGroup, .fof-upload-download, div[data-fof-upload-download-uuid]');

      fofElements.forEach(el => {
        if (el.dataset.plyrDone) return;

        const text = (el.innerText || el.textContent || '').toLowerCase();
        if (text.includes('.mp4')) {
          const linkTag = el.querySelector('a') || el.closest('a') || el.querySelector('.Button');
          let videoSrc = null;

          if (linkTag && linkTag.href) {
            videoSrc = linkTag.href;
          } else {
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

    let elementToReplace = targetEl;
    if (targetEl.classList.contains('Button') && targetEl.closest('.ButtonGroup')) {
      elementToReplace = targetEl.closest('.ButtonGroup');
    }

    if (elementToReplace && elementToReplace.parentNode) {
      elementToReplace.parentNode.replaceChild(wrapper, elementToReplace);

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
    const target = document.getElementById('app') || document.body;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  });
})();
</script>

<style>
  /* Floating Music Chatroom */
  #music-chat-widget {
    position: fixed;
    bottom: 70px;
    right: 15px;
    left: 15px;
    width: auto;
    height: 420px;
    max-height: calc(100vh - 120px);
    background: #121318;
    border: 1px solid #2a2d3d;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    display: flex;
    flex-direction: column;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  #music-chat-widget.minimized {
    height: 48px !important;
    left: auto;
    right: 15px;
    width: 220px;
  }

  #music-chat-widget.minimized #music-chat-messages,
  #music-chat-widget.minimized #music-chat-input-area,
  #music-chat-widget.minimized #chat-mention-dropdown {
    display: none !important;
  }

  #music-chat-header {
    background: #1a1c24;
    padding: 12px 16px;
    border-bottom: 1px solid #2a2d3d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }

  #music-chat-toggle {
    background: transparent;
    border: none;
    color: #00f0ff;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
  }

  #music-chat-messages {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #0b0c10;
    -webkit-overflow-scrolling: touch;
  }

  .chat-msg {
    display: flex;
    gap: 10px;
    background: #181a22;
    padding: 10px;
    border-radius: 8px;
    font-size: 13px;
    position: relative;
  }

  .chat-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #00f0ff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
  }

  .chat-body {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-wrap: anywhere;
  }

  .chat-msg-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }

  .chat-user {
    font-size: 11px;
    color: #00f0ff;
    font-weight: 600;
  }

  .chat-delete-btn {
    background: transparent;
    border: none;
    color: #ff5555;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    padding: 0 4px;
    opacity: 0.7;
    line-height: 1;
  }

  .chat-delete-btn:hover {
    color: #ff0000;
  }

  .chat-text {
    color: #e2e8f0;
    line-height: 1.4;
  }

  .chat-mention {
    color: #ff007f;
    font-weight: bold;
    background: rgba(255, 0, 127, 0.2);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .chat-link {
    color: #00f0ff;
    text-decoration: underline;
  }

  .embed-container {
    margin-top: 8px;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
  }

  .embed-container iframe {
    display: block;
    border: none;
    width: 100% !important;
  }

  #music-chat-input-area {
    position: relative;
    padding: 10px;
    background: #1a1c24;
    border-top: 1px solid #2a2d3d;
    display: flex;
    gap: 8px;
  }

  #music-chat-input {
    flex: 1;
    background: #0b0c10;
    border: 1px solid #2a2d3d;
    color: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    outline: none;
    font-size: 13px;
  }

  #music-chat-send {
    background: #00f0ff;
    color: #000;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }

  #chat-mention-dropdown {
    display: none;
    position: absolute;
    bottom: 58px;
    left: 10px;
    right: 10px;
    background: #1a1c24;
    border: 1px solid #00f0ff;
    border-radius: 8px;
    max-height: 140px;
    overflow-y: auto;
    z-index: 100000;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.6);
  }

  .mention-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    cursor: pointer;
    color: #e2e8f0;
    font-size: 13px;
    border-bottom: 1px solid #2a2d3d;
  }

  .mention-item:last-child {
    border-bottom: none;
  }

  .mention-item-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #00f0ff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
  }
</style>

<div id="music-chat-widget">
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
</div>

<script>
(function() {
  try {
    var SUPABASE_URL = 'https://cfanvjxfpiqnufjnlznk.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_i_haAhG7GFl5JHpzBKpxlQ_97Dsl_JB';

    var sb = (typeof supabase !== 'undefined' && SUPABASE_URL.indexOf('YOUR-PROJECT') === -1) 
      ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) 
      : null;

    var widget = document.getElementById('music-chat-widget');
    var header = document.getElementById('music-chat-header');
    var toggleBtn = document.getElementById('music-chat-toggle');
    var msgContainer = document.getElementById('music-chat-messages');
    var inputEl = document.getElementById('music-chat-input');
    var sendBtn = document.getElementById('music-chat-send');
    var dropdownEl = document.getElementById('chat-mention-dropdown');

    function requestNotificationPermission() {
      try {
        if ("Notification" in window && Notification.permission === "default") {
          Notification.requestPermission();
        }
      } catch (e) {}
    }

    function triggerBrowserNotification(sender, messageText) {
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🎵 " + sender + " heeft je genoemd!", {
            body: messageText,
            icon: "/favicon.ico"
          });
        }
      } catch (e) {}
    }

    if (inputEl) inputEl.addEventListener('focus', requestNotificationPermission);

    function toggleChat() {
      widget.classList.toggle('minimized');
      toggleBtn.innerText = widget.classList.contains('minimized') ? '+' : '−';
    }

    if (header) header.addEventListener('click', toggleChat);

    function getFlarumUser() {
      try {
        if (window.app && app.session && app.session.user) {
          var u = app.session.user;
          return {
            name: typeof u.attribute === 'function' ? u.attribute('username') : (u.username || 'User'),
            avatar: typeof u.attribute === 'function' ? u.attribute('avatarUrl') : (u.avatarUrl || null)
          };
        }
      } catch (e) {}
      return { name: 'Guest_' + Math.floor(Math.random() * 1000), avatar: null };
    }

    function getAllUsers() {
      var usersMap = {};
      var usersList = [];
      try {
        if (window.app && app.store) {
          app.store.all('users').forEach(function(u) {
            var name = typeof u.attribute === 'function' ? u.attribute('username') : u.username;
            var avatar = typeof u.attribute === 'function' ? u.attribute('avatarUrl') : u.avatarUrl;
            if (name && !usersMap[name.toLowerCase()]) {
              usersMap[name.toLowerCase()] = true;
              usersList.push({ name: name, avatar: avatar });
            }
          });
        }
      } catch(e) {}

      document.querySelectorAll('.chat-user').forEach(function(el) {
        var name = el.innerText;
        if (name && !usersMap[name.toLowerCase()]) {
          usersMap[name.toLowerCase()] = true;
          usersList.push({ name: name, avatar: null });
        }
      });

      return usersList;
    }

    function hideDropdown() {
      if (dropdownEl) dropdownEl.style.display = 'none';
    }

    function showDropdown(matches, atPos) {
      if (!dropdownEl) return;
      dropdownEl.innerHTML = '';
      matches.forEach(function(u) {
        var item = document.createElement('div');
        item.className = 'mention-item';
        var initial = u.name.charAt(0).toUpperCase();
        var avatarHtml = u.avatar ? '<img src="' + u.avatar + '" class="mention-item-avatar" />' : '<div class="mention-item-avatar">' + initial + '</div>';
        item.innerHTML = avatarHtml + '<span>' + u.name + '</span>';
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          insertMention(u.name, atPos);
        });
        dropdownEl.appendChild(item);
      });
      dropdownEl.style.display = 'block';
    }

    function insertMention(username, atPos) {
      var text = inputEl.value;
      inputEl.value = text.substring(0, atPos) + '@' + username + ' ' + text.substring(inputEl.selectionStart);
      hideDropdown();
      inputEl.focus();
    }

    if (inputEl) {
      inputEl.addEventListener('input', function() {
        var text = inputEl.value;
        var lastAtPos = text.substring(0, inputEl.selectionStart).lastIndexOf('@');
        if (lastAtPos !== -1) {
          var query = text.substring(lastAtPos + 1, inputEl.selectionStart).toLowerCase();
          if (!query.includes(' ')) {
            var matches = getAllUsers().filter(u => u.name.toLowerCase().startsWith(query));
            if (matches.length > 0) {
              showDropdown(matches, lastAtPos);
              return;
            }
          }
        }
        hideDropdown();
      });
    }

    document.addEventListener('click', hideDropdown);

    function parseFormattedText(text) {
      var div = document.createElement('div');
      div.innerText = text;
      var escaped = div.innerHTML.replace(/@([a-zA-Z0-9_-]+)/g, '<span class="chat-mention">@$1</span>');

      var embedHtml = '';
      var scUrls = [];

      var spotifyMatch = /(https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|artist|episode)\/([a-zA-Z0-9]+))/i.exec(text);
      if (spotifyMatch) {
        embedHtml += '<div class="embed-container"><iframe src="https://open.spotify.com/embed/' + spotifyMatch[2] + '/' + spotifyMatch[3] + '" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>';
      }

      var scMatch = /(https?:\/\/(?:www\.|on\.)?soundcloud\.com\/[^\s]+)/i.exec(text);
      if (scMatch && !spotifyMatch) {
        var uniqueId = 'sc-embed-' + Math.random().toString(36).substring(2, 9);
        embedHtml += '<div class="embed-container" id="' + uniqueId + '"></div>';
        scUrls.push({ id: uniqueId, url: scMatch[0] });
      }

      var ytMatch = /(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i.exec(text);
      if (ytMatch && ytMatch[1] && !spotifyMatch && !scMatch) {
        embedHtml += '<div class="embed-container"><iframe width="100%" height="180" src="https://www.youtube-nocookie.com/embed/' + ytMatch[1] + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
      }

      escaped = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="chat-link">$1</a>');
      return { html: escaped + embedHtml, scUrls: scUrls };
    }

    function renderMessage(data, isLiveNew) {
      if (!msgContainer || (data.id && document.querySelector('.chat-msg[data-id="' + data.id + '"]'))) return;

      var div = document.createElement('div');
      div.className = 'chat-msg';
      if (data.id) div.setAttribute('data-id', data.id);

      var initial = data.username ? data.username.charAt(0).toUpperCase() : '?';
      var avatarHtml = data.avatar_url ? '<img src="' + data.avatar_url + '" class="chat-avatar" />' : '<div class="chat-avatar">' + initial + '</div>';
      var parsed = parseFormattedText(data.message);

      div.innerHTML = avatarHtml +
        '<div class="chat-body">' +
          '<div class="chat-msg-header">' +
            '<span class="chat-user">' + data.username + '</span>' +
            '<button class="chat-delete-btn" title="Delete message">✕</button>' +
          '</div>' +
          '<span class="chat-text">' + parsed.html + '</span>' +
        '</div>';

      if (parsed.scUrls.length > 0) {
        parsed.scUrls.forEach(scInfo => {
          var holder = div.querySelector('#' + scInfo.id);
          if (holder) {
            fetch('https://soundcloud.com/oembed?url=' + encodeURIComponent(scInfo.url) + '&format=json&maxheight=120')
              .then(r => r.json())
              .then(scData => {
                if (scData && scData.html) {
                  holder.innerHTML = scData.html;
                  var iframe = holder.querySelector('iframe');
                  if (iframe) { iframe.style.width = '100%'; iframe.style.height = '120px'; }
                }
              }).catch(() => {});
          }
        });
      }

      div.querySelector('.chat-delete-btn').addEventListener('click', async function(e) {
        e.stopPropagation();
        if (confirm('Verwijderen?')) {
          if (sb && data.id) await sb.from('chat_messages').delete().eq('id', data.id);
          div.remove();
        }
      });

      msgContainer.appendChild(div);
      msgContainer.scrollTop = msgContainer.scrollHeight;

      if (isLiveNew) {
        var currentUser = getFlarumUser();
        if (currentUser.name && data.username !== currentUser.name && data.message.toLowerCase().includes('@' + currentUser.name.toLowerCase())) {
          triggerBrowserNotification(data.username, data.message);
        }
      }
    }

    async function sendMessage() {
      if (!inputEl) return;
      var text = inputEl.value.trim();
      if (!text) return;
      var user = getFlarumUser();
      inputEl.value = '';

      if (sb) {
        await sb.from('chat_messages').insert([{ username: user.name, avatar_url: user.avatar, message: text }]);
      } else {
        renderMessage({ username: user.name, avatar_url: user.avatar, message: text }, true);
      }
    }

    if (sendBtn) sendBtn.addEventListener('click', (e) => { e.stopPropagation(); sendMessage(); });
    if (inputEl) {
      inputEl.addEventListener('click', (e) => e.stopPropagation());
      inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    }

    if (sb) {
      sb.from('chat_messages').select('*').order('id', { ascending: true }).limit(30).then(res => {
        if (res.data) {
          msgContainer.innerHTML = '';
          res.data.forEach(msg => renderMessage(msg, false));
        }
      });

      sb.channel('public:chat_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, p => renderMessage(p.new, true))
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages' }, p => {
          var el = msgContainer.querySelector('.chat-msg[data-id="' + p.old.id + '"]');
          if (el) el.remove();
        })
        .subscribe();
    }
  } catch (err) {}
})();
</script>

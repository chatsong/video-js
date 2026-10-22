<script>
(function() {
  'use strict';

  // Functie om de knop exact dezelfde grootte te geven als de Indie Artist badge
  function injectHeaderShareButton() {
    document.querySelectorAll('.Post-header > ul').forEach(ul => {
      if (!ul.querySelector('.item-cs-header-share')) {
        const li = document.createElement('li');
        li.className = 'item-cs-header-share';
        li.style.display = 'inline-flex';
        li.style.alignItems = 'center';
        li.style.marginTop = '4px';

        // Knop met exact dezelfde padding, font-size en stijl als .RankBanner (Indie artist)
        li.innerHTML = `
          <button class="Button cs-header-share-btn" type="button" title="Share to Instagram Story" style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045) !important; color: #fff !important; border: none !important; padding: 8px 14px !important; border-radius: 12px !important; font-size: 13px !important; font-weight: 700 !important; cursor: pointer !important; display: inline-flex !important; align-items: center !important; gap: 6px !important; box-shadow: 0 2px 6px rgba(225, 48, 108, 0.4) !important;">
            <i class="icon fab fa-instagram" style="font-size: 15px !important;"></i>
            <span class="Button-label" style="color: #fff !important; font-size: 13px !important; font-weight: 700 !important;">Share your topic</span>
          </button>
        `;

        ul.appendChild(li);

        // Koppel de Canvas generator aan de knop
        li.querySelector('button').addEventListener('click', function(e) {
          e.preventDefault();
          const postEl = e.target.closest('.Post');
          generateAndShareIGStory(postEl);
        });
      }
    });
  }

  // Canvas Generator & Deel-functie
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
          alert('Instagram Story afbeelding gedownload! Je kunt deze direct uploaden naar je Instagram Story.');
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


  /* ==========================================================
     2. A-Z FILTER BAR (User Directory)
     ========================================================== */
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


  /* ==========================================================
     3. STICKY ACCORDION (Forum Activity)
     ========================================================== */
  function initStickyAccordion() {
    if (isUserTyping()) return; // Stop als de gebruiker typt

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


  /* ==========================================================
     GEOPTIMALISEERDE UITVOERING (Met debounce / throttling)
     ========================================================== */
  let timeout = null;
  const observer = new MutationObserver(function() {
    if (isUserTyping()) return; // Geen DOM-acties tijdens het typen
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      injectIGStoryToPostActions();
      injectAZBar();
      initStickyAccordion();
    }, 250); // Voer pas uit 250ms nadat de laatste DOM-wijziging is gestopt
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Veilige, trage interval (elke 2 seconden in plaats van 500ms) om ontbrekende elementen op te vangen
  setInterval(function() {
    if (!isUserTyping()) {
      injectIGStoryToPostActions();
      injectAZBar();
      initStickyAccordion();
    }
  }, 2000);

  // Initiële check bij laden
  window.addEventListener('DOMContentLoaded', () => {
    injectIGStoryToPostActions();
    injectAZBar();
    initStickyAccordion();
  });

})();
</script>
<style>
  /* Geef de verborgen klasse een hogere specificiteit zodat deze wint van de grid-weergave */
  .ForumActivity-table tr.ForumActivity-row.cs-collapsed-row {
    display: none !important;
  }
</style>

<script>
(function() {
    'use strict';
    
    // Voeg de badge toe aan de sticky header als deze er nog niet staat
    function initSticky() {
        document.querySelectorAll('.ForumActivity-sectionHead').forEach(function(head) {
            var text = head.textContent || '';
            if (!text.toLowerCase().includes('sticky')) return;
            
            head.style.cursor = 'pointer';
            head.style.userSelect = 'none';
            
            // Controleer of de badge al bestaat, zo niet, voeg hem toe
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
                badge.innerHTML = '▼ Collapse'; // Standaardstaat is open, dus tekst is Collapse
                
                // Voeg de badge toe aan de cel of header
                var cell = head.querySelector('td') || head;
                cell.appendChild(badge);
            }
        });
    }
    
    // Vang de klik op de sticky sectie op
    document.addEventListener('click', function(e) {
        var head = e.target.closest('.ForumActivity-sectionHead');
        if (!head) return;
        
        var text = head.textContent || '';
        if (!text.toLowerCase().includes('sticky')) return;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Toggle de ingeklapte status
        var isCollapsed = head.classList.toggle('cs-collapsed');
        
        // Pas de badge tekst en pijl aan op basis van de status
        var badge = head.querySelector('.accordion-badge');
        if (badge) {
            if (isCollapsed) {
                badge.innerHTML = '▶ Expand';
            } else {
                badge.innerHTML = '▼ Collapse';
            }
        }
        
        // Zoek alle rijen erachter tot de volgende sectie en verberg/toon ze
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
     UNIVERSELE MOBILE, PRE-SAVE & SOCIAL FIXER (CHATSONG FOOTER)
     - Includes DistroKid, Pre-Saves, Anti-Duplication & English
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
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('soundcloud.com') || lower.includes('snd.sc')) return 'soundcloud';
    if (lower.includes('spotify.com')) return 'spotify';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('linktr.ee') || lower.includes('beacons.ai') || lower.includes('bio.link')) return 'linktree';
    return 'generic';
  }

  function createPlatformCard(url, type) {
    var rawClean = url.split('?')[0].replace(/\/$/, '');
    var parts = rawClean.split('/');
    var identifier = parts[parts.length - 1] || 'Release';

    var config = {
      distrokid: {
        bg: 'linear-gradient(135deg, #00C6FF, #0072FF)',
        icon: 'fas fa-compact-disc',
        title: 'DistroKid / HyperFollow',
        sub: 'Pre-save or stream release'
      },
      presave: {
        bg: 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
        icon: 'fas fa-music',
        title: 'Pre-Save / Smart Link',
        sub: 'Pre-save or choose music platform'
      },
      instagram: {
        bg: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
        icon: 'fab fa-instagram',
        title: 'Instagram',
        sub: 'View profile or post on Instagram'
      },
      youtube: {
        bg: 'linear-gradient(135deg, #FF0000, #CC0000)',
        icon: 'fab fa-youtube',
        title: 'YouTube',
        sub: 'View video or channel on YouTube'
      },
      soundcloud: {
        bg: 'linear-gradient(135deg, #FF5500, #FF3300)',
        icon: 'fab fa-soundcloud',
        title: 'SoundCloud',
        sub: 'Listen on SoundCloud'
      },
      spotify: {
        bg: 'linear-gradient(135deg, #1DB954, #191414)',
        icon: 'fab fa-spotify',
        title: 'Spotify',
        sub: 'Open in Spotify'
      },
      tiktok: {
        bg: 'linear-gradient(135deg, #000000, #25F4EE, #FE2C55)',
        icon: 'fab fa-tiktok',
        title: 'TikTok',
        sub: 'View on TikTok'
      },
      linktree: {
        bg: 'linear-gradient(135deg, #39E09B, #1E293B)',
        icon: 'fas fa-tree',
        title: 'Linktree / Bio',
        sub: 'View creator links'
      },
      generic: {
        bg: 'rgba(255,255,255,0.08)',
        icon: 'fas fa-external-link-alt',
        title: 'External Link',
        sub: rawClean
      }
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

      // 1. Ruim eventuele eerder gemaakte dubbele kaarten op
      var existingCards = body.querySelectorAll('a.cs-custom-card');
      existingCards.forEach(function(cardA) {
        var cUrl = cleanUrl(cardA.href);
        if (handledUrls.indexOf(cUrl) !== -1) {
          cardA.remove();
        } else {
          handledUrls.push(cUrl);
        }
      });

      // 2. Verwerk LinkPreview foutmeldingen & blokken
      var previews = body.querySelectorAll('.LinkPreview');
      previews.forEach(function(preview) {
        var link = preview.closest('a') || preview.querySelector('a') || preview.parentElement;
        var rawUrl = link ? (link.href || '') : '';
        if (!rawUrl) {
          var match = (preview.innerText || '').match(/(https?:\/\/[^\s]+)/);
          if (match) rawUrl = match[0];
        }

        if (!rawUrl) return;

        var cUrl = cleanUrl(rawUrl);
        var isError = (preview.innerText || '').includes('Unable to load preview') || (preview.innerText || '').includes('Please check the URL') || (preview.innerText || '').trim() === '';
        var platform = detectPlatform(rawUrl);

        var targetToReplace = preview.closest('a') || preview;

        if (platform !== 'generic' || isError) {
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

      // 3. Verwerk overige losse/ruwe links in hetzelfde bericht
      var rawLinks = body.querySelectorAll('a:not(.cs-custom-card)');
      rawLinks.forEach(function(a) {
        if (a.closest('.cs-custom-card') || a.closest('.LinkPreview')) return;

        var rawUrl = a.href || a.innerText;
        if (!rawUrl || !rawUrl.startsWith('http')) return;

        var cUrl = cleanUrl(rawUrl);
        var platform = detectPlatform(rawUrl);

        if (handledUrls.indexOf(cUrl) !== -1) {
          a.remove();
        } else if (platform !== 'generic') {
          var newCard = createPlatformCard(rawUrl, platform);
          handledUrls.push(cUrl);
          if (a.parentNode) {
            a.parentNode.replaceChild(newCard, a);
          }
        }
      });
    });
  }

  window.addEventListener('flarum:page:changed', function() {
    setTimeout(processPostBodies, 300);
  });

  var observer = new MutationObserver(function() {
    processPostBodies();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
</script>

<style>
  /* Floating Music Chatroom - Net boven de mobile tab */
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

  /* Minimized State */
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
      } catch (e) { console.error('Notification error:', e); }
    }

    function triggerBrowserNotification(sender, messageText) {
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🎵 " + sender + " heeft je genoemd!", {
            body: messageText,
            icon: "/favicon.ico"
          });
        }
      } catch (e) { console.error('Browser Notification error:', e); }
    }

    if (inputEl) inputEl.addEventListener('focus', requestNotificationPermission);

    function toggleChat() {
      widget.classList.toggle('minimized');
      if (widget.classList.contains('minimized')) {
        toggleBtn.innerText = '+';
      } else {
        toggleBtn.innerText = '−';
      }
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
      } catch (e) { console.error('Flarum user fetch error:', e); }
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

      var userElems = document.querySelectorAll('.chat-user');
      userElems.forEach(function(el) {
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
        var avatarHtml = u.avatar 
          ? '<img src="' + u.avatar + '" class="mention-item-avatar" />'
          : '<div class="mention-item-avatar">' + initial + '</div>';

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
      var beforeAt = text.substring(0, atPos);
      var afterAt = text.substring(inputEl.selectionStart);
      inputEl.value = beforeAt + '@' + username + ' ' + afterAt;
      hideDropdown();
      inputEl.focus();
    }

    if (inputEl) {
      inputEl.addEventListener('input', function() {
        var text = inputEl.value;
        var cursorPos = inputEl.selectionStart;
        var textBeforeCursor = text.substring(0, cursorPos);
        var lastAtPos = textBeforeCursor.lastIndexOf('@');

        if (lastAtPos !== -1) {
          var query = textBeforeCursor.substring(lastAtPos + 1).toLowerCase();
          if (!query.includes(' ')) {
            var allUsers = getAllUsers();
            var matches = allUsers.filter(function(u) {
              return u.name.toLowerCase().startsWith(query);
            });

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
      var escaped = div.innerHTML;

      escaped = escaped.replace(/@([a-zA-Z0-9_-]+)/g, '<span class="chat-mention">@$1</span>');

      var embedHtml = '';
      var scUrls = [];

      // 1. Spotify Embed
      var spotifyRegex = /(https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|artist|episode)\/([a-zA-Z0-9]+))/i;
      var spotifyMatch = spotifyRegex.exec(text);
      if (spotifyMatch) {
        embedHtml += '<div class="embed-container"><iframe src="https://open.spotify.com/embed/' + spotifyMatch[2] + '/' + spotifyMatch[3] + '" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>';
      }

      // 2. SoundCloud Embed
      var scRegex = /(https?:\/\/(?:www\.|on\.)?soundcloud\.com\/[^\s]+)/i;
      var scMatch = scRegex.exec(text);
      if (scMatch && !spotifyMatch) {
        var uniqueId = 'sc-embed-' + Math.random().toString(36).substring(2, 9);
        embedHtml += '<div class="embed-container" id="' + uniqueId + '"></div>';
        scUrls.push({ id: uniqueId, url: scMatch[0] });
      }

      // 3. YouTube Embed
      var ytRegex = /(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
      var ytMatch = ytRegex.exec(text);
      if (ytMatch && ytMatch[1] && !spotifyMatch && !scMatch) {
        var ytId = ytMatch[1];
        embedHtml += '<div class="embed-container"><iframe width="100%" height="180" src="https://www.youtube-nocookie.com/embed/' + ytId + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
      }

      // 4. Beatport Embed
      var bpRegex = /(?:beatport\.com\/(?:[a-z]{2}\/)?(track|release)\/[^\/]+\/([0-9]+))/i;
      var bpMatch = bpRegex.exec(text);
      if (bpMatch && bpMatch[2] && !spotifyMatch && !scMatch && !ytMatch) {
        var bpType = bpMatch[1];
        var bpId = bpMatch[2];
        embedHtml += '<div class="embed-container"><iframe src="https://embed.beatport.com/?id=' + bpId + '&type=' + bpType + '" width="100%" height="160" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>';
      }

      // 5. Mixcloud Embed
      var mcRegex = /(https?:\/\/(?:www\.)?mixcloud\.com\/[^\s]+)/i;
      var mcMatch = mcRegex.exec(text);
      if (mcMatch && !spotifyMatch && !scMatch && !ytMatch && !bpMatch) {
        var mcUrl = mcMatch[0];
        embedHtml += '<div class="embed-container"><iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?feed=' + encodeURIComponent(mcUrl) + '&hide_cover=0&light=0" frameborder="0" allow="autoplay"></iframe></div>';
      }

      escaped = escaped.replace(/(https?:\/\/[^\s]+)/g, function(url) {
        return '<a href="' + url + '" target="_blank" class="chat-link">' + url + '</a>';
      });

      return { html: escaped + embedHtml, scUrls: scUrls };
    }

    function renderMessage(data, isLiveNew) {
      if (!msgContainer) return;
      if (data.id && document.querySelector('.chat-msg[data-id="' + data.id + '"]')) {
        return;
      }

      var div = document.createElement('div');
      div.className = 'chat-msg';
      if (data.id) div.setAttribute('data-id', data.id);
      
      var initial = data.username ? data.username.charAt(0).toUpperCase() : '?';
      var avatarHtml = data.avatar_url 
        ? '<img src="' + data.avatar_url + '" class="chat-avatar" />'
        : '<div class="chat-avatar">' + initial + '</div>';

      var parsed = parseFormattedText(data.message);

      div.innerHTML = avatarHtml +
        '<div class="chat-body">' +
          '<div class="chat-msg-header">' +
            '<span class="chat-user">' + data.username + '</span>' +
            '<button class="chat-delete-btn" title="Delete message">✕</button>' +
          '</div>' +
          '<span class="chat-text">' + parsed.html + '</span>' +
        '</div>';

      if (parsed.scUrls && parsed.scUrls.length > 0) {
        parsed.scUrls.forEach(function(scInfo) {
          var holder = div.querySelector('#' + scInfo.id);
          if (holder) {
            fetch('https://soundcloud.com/oembed?url=' + encodeURIComponent(scInfo.url) + '&format=json&maxheight=120')
              .then(function(r) { return r.json(); })
              .then(function(scData) {
                if (scData && scData.html) {
                  holder.innerHTML = scData.html;
                  var iframe = holder.querySelector('iframe');
                  if (iframe) {
                    iframe.style.width = '100%';
                    iframe.style.height = '120px';
                  }
                }
              })
              .catch(function(err) {});
          }
        });
      }

      var deleteBtn = div.querySelector('.chat-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async function(e) {
          e.stopPropagation();
          if (confirm('Wil je dit bericht verwijderen?')) {
            if (sb && data.id) {
              await sb.from('chat_messages').delete().eq('id', data.id);
            }
            div.remove();
          }
        });
      }

      msgContainer.appendChild(div);
      msgContainer.scrollTop = msgContainer.scrollHeight;

      if (isLiveNew) {
        var currentUser = getFlarumUser();
        if (currentUser.name && data.username !== currentUser.name) {
          var mentionTag = '@' + currentUser.name.toLowerCase();
          if (data.message.toLowerCase().includes(mentionTag)) {
            triggerBrowserNotification(data.username, data.message);
          }
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
        await sb.from('chat_messages').insert([
          { username: user.name, avatar_url: user.avatar, message: text }
        ]);
      } else {
        renderMessage({ username: user.name, avatar_url: user.avatar, message: text }, true);
      }
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        sendMessage();
      });
    }

    if (inputEl) {
      inputEl.addEventListener('click', function(e) {
        e.stopPropagation();
      });

      inputEl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
      });
    }

    if (sb) {
      sb.from('chat_messages').select('*').order('id', { ascending: true }).limit(30).then(function(res) {
        if (res.data) {
          msgContainer.innerHTML = '';
          res.data.forEach(function(msg) {
            renderMessage(msg, false);
          });
        }
      });

      sb.channel('public:chat_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, function(payload) {
          renderMessage(payload.new, true);
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages' }, function(payload) {
          var el = msgContainer.querySelector('.chat-msg[data-id="' + payload.old.id + '"]');
          if (el) el.remove();
        })
        .subscribe();
    }
  } catch (err) {
    console.error('Critical Widget Error:', err);
  }
})();
</script>

<style>
/* Leaderboard Styling - Werkt nu identiek op Desktop én Mobiel */
.LeaderboardPage { padding: 15px; width: 100%; box-sizing: border-box; }
.LeaderboardHero {
    background: linear-gradient(135deg, #8a2be2 0%, #ff007f 100%);
    color: #fff;
    padding: 20px 10px;
    border-radius: 12px;
    margin-bottom: 20px;
    text-align: center;
}
.LeaderboardHero .Hero-title { font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; margin: 0; color: #fff; }

.LeaderboardPodium {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 25px;
    flex-wrap: nowrap;
    width: 100%;
}
.LeaderboardPodium-place {
    background: var(--body-bg, #fff);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 10px;
    padding: 12px 8px;
    text-align: center;
    flex: 1;
    min-width: 0;
    max-width: 160px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.LeaderboardPodium-place--1 { order: 2; transform: translateY(-6px); border-color: #ffd700; background: linear-gradient(to bottom, rgba(255,215,0,0.08), transparent); }
.LeaderboardPodium-place--2 { order: 1; }
.LeaderboardPodium-place--3 { order: 3; }

.LeaderboardPodium-medal {
    font-weight: 800;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 8px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 3px;
    white-space: nowrap;
}
.LeaderboardPodium-medal--gold { background: #ffd700; color: #fff; }
.LeaderboardPodium-medal--silver { background: #c0c0c0; color: #fff; }
.LeaderboardPodium-medal--bronze { background: #cd7f32; color: #fff; }

.LeaderboardPodium-avatar img, .LeaderboardContenders-avatar img, .LeaderboardItem-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 6px;
}
.LeaderboardPodium-place--1 .LeaderboardPodium-avatar img { width: 50px; height: 50px; }

.LeaderboardPodium-name, .LeaderboardContenders-name, .LeaderboardItem-name {
    font-weight: 700;
    font-size: 12px;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}
.LeaderboardPodium-points, .LeaderboardContenders-points, .LeaderboardItem-points {
    font-size: 10px;
    color: var(--primary-color, #8a2be2);
    font-weight: 600;
}

.LeaderboardContenders-title, .LeaderboardHonorable-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.LeaderboardContenders-grid, .LeaderboardHonorable-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 8px;
    margin-bottom: 20px;
}
.LeaderboardContenders-card, .LeaderboardItem {
    background: var(--body-bg, #fff);
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
    box-sizing: border-box;
}
.LeaderboardContenders-rank, .LeaderboardItem-rank {
    font-weight: 700;
    font-size: 11px;
    color: #888;
    min-width: 18px;
}
.LeaderboardContenders-card .LeaderboardContenders-avatar img,
.LeaderboardItem .LeaderboardItem-avatar img {
    width: 28px;
    height: 28px;
    margin-bottom: 0;
}

/* Mobiele optimalisatie voor schermen kleiner dan 576px */
@media (max-width: 576px) {
    .LeaderboardPage { padding: 8px; }
    .LeaderboardHero { padding: 12px 6px; margin-bottom: 12px; }
    .LeaderboardHero .Hero-title { font-size: 15px; }
    
    .LeaderboardPodium { gap: 4px; margin-bottom: 15px; }
    .LeaderboardPodium-place { padding: 8px 4px; }
    .LeaderboardPodium-avatar img { width: 32px !important; height: 32px !important; }
    .LeaderboardPodium-place--1 .LeaderboardPodium-avatar img { width: 40px !important; height: 40px !important; }
    .LeaderboardPodium-name { font-size: 10px; }
    
    .LeaderboardContenders-grid, .LeaderboardHonorable-grid {
        grid-template-columns: 1fr;
        gap: 6px;
    }
}
</style>

<script>
(function() {
    function renderLeaderboard() {
        if (!window.location.pathname.includes('/rankings')) {
            const existing = document.querySelector('.LeaderboardPage');
            if (existing) existing.remove();
            return;
        }

        // Gebruik .IndexPage omdat deze zowel op mobiel als desktop bestaat
        const indexPage = document.querySelector('.IndexPage');
        if (!indexPage) return;

        const rows = document.querySelectorAll('table.rankings tr, tr[class*="ranking"], .rankings-list li');
        if (rows.length === 0) return;

        // Verberg de originele tabellen/lijsten zodat ze niet storen
        const originals = document.querySelectorAll('table.rankings, .rankings-list');
        originals.forEach(el => el.style.display = 'none');
        const loadMore = document.querySelector('.rankings-loadmore');
        if (loadMore) loadMore.style.display = 'none';

        if (indexPage.querySelector('.LeaderboardPage')) return;

        let usersData = [];
        rows.forEach((row) => {
            if (row.querySelector('th')) return;
            
            const nameEl = row.querySelector('.username, a');
            const linkEl = row.querySelector('a');
            const avatarEl = row.querySelector('img.Avatar, img');
            const pointsEl = row.querySelector('td:last-child, .points');
            
            if (nameEl) {
                const nameText = nameEl.innerText.trim();
                const profileLink = linkEl ? linkEl.getAttribute('href') : '#';
                const pointsText = pointsEl ? pointsEl.innerText.trim() : '0';

                let avatarSrc = (avatarEl && avatarEl.src && !avatarEl.src.includes('ui-avatars')) 
                    ? avatarEl.src 
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(nameText)}&background=random&color=fff&bold=true&size=128`;

                if (nameText && !usersData.some(u => u.name === nameText)) {
                    usersData.push({
                        rank: usersData.length + 1,
                        name: nameText,
                        avatar: avatarSrc,
                        points: pointsText + ' Points',
                        link: profileLink
                    });
                }
            }
        });

        if (usersData.length === 0) return;

        let newHTML = `
        <div class="LeaderboardPage">
            <header class="Hero LeaderboardHero">
                <div class="container">
                    <div class="containerNarrow">
                        <h1 class="Hero-title"><i class="fas fa-trophy"></i> Leaderboard</h1>
                    </div>
                </div>
            </header>
        `;

        if (usersData.length >= 3) {
            const p1 = usersData[0], p2 = usersData[1], p3 = usersData[2];
            newHTML += `
            <div class="LeaderboardPodium">
                <a href="${p2.link}" class="LeaderboardPodium-place LeaderboardPodium-place--2">
                    <div class="LeaderboardPodium-medal LeaderboardPodium-medal--silver"><span class="LeaderboardPodium-rankNumber">#2</span></div>
                    <div class="LeaderboardPodium-avatar"><img class="Avatar" src="${p2.avatar}"></div>
                    <div class="LeaderboardPodium-name">${p2.name}</div>
                    <div class="LeaderboardPodium-points">${p2.points}</div>
                </a>
                <a href="${p1.link}" class="LeaderboardPodium-place LeaderboardPodium-place--1">
                    <div class="LeaderboardPodium-medal LeaderboardPodium-medal--gold"><i class="fas fa-crown"></i><span class="LeaderboardPodium-rankNumber">#1</span></div>
                    <div class="LeaderboardPodium-avatar"><img class="Avatar" src="${p1.avatar}"></div>
                    <div class="LeaderboardPodium-name">${p1.name}</div>
                    <div class="LeaderboardPodium-points">${p1.points}</div>
                </a>
                <a href="${p3.link}" class="LeaderboardPodium-place LeaderboardPodium-place--3">
                    <div class="LeaderboardPodium-medal LeaderboardPodium-medal--bronze"><span class="LeaderboardPodium-rankNumber">#3</span></div>
                    <div class="LeaderboardPodium-avatar"><img class="Avatar" src="${p3.avatar}"></div>
                    <div class="LeaderboardPodium-name">${p3.name}</div>
                    <div class="LeaderboardPodium-points">${p3.points}</div>
                </a>
            </div>`;
        }

        const contenders = usersData.slice(3, 10);
        if (contenders.length > 0) {
            newHTML += `
            <div class="LeaderboardContenders">
                <h3 class="LeaderboardContenders-title"><i class="fas fa-medal"></i> Top Contenders</h3>
                <div class="LeaderboardContenders-grid">`;
            contenders.forEach(user => {
                newHTML += `
                    <a href="${user.link}" class="LeaderboardContenders-card">
                        <span class="LeaderboardContenders-rank">#${user.rank}</span>
                        <div class="LeaderboardContenders-avatar"><img class="Avatar" src="${user.avatar}"></div>
                        <div>
                            <div class="LeaderboardContenders-name">${user.name}</div>
                            <div class="LeaderboardContenders-points">${user.points}</div>
                        </div>
                    </a>`;
            });
            newHTML += `</div></div>`;
        }

        const honorable = usersData.slice(10);
        if (honorable.length > 0) {
            newHTML += `
            <div class="LeaderboardHonorable">
                <h3 class="LeaderboardHonorable-title"><i class="fas fa-list-ol"></i> Honorable Mentions</h3>
                <div class="LeaderboardHonorable-grid">`;
            honorable.forEach(user => {
                newHTML += `
                    <a href="${user.link}" class="LeaderboardItem">
                        <span class="LeaderboardItem-rank">#${user.rank}</span>
                        <span class="LeaderboardItem-avatar"><img class="Avatar" src="${user.avatar}"></span>
                        <div>
                            <div class="LeaderboardItem-name">${user.name}</div>
                            <div class="LeaderboardItem-points">${user.points}</div>
                        </div>
                    </a>`;
            });
            newHTML += `</div></div>`;
        }

        newHTML += `</div>`;
        
        indexPage.insertAdjacentHTML('afterbegin', newHTML);
    }

    window.addEventListener('DOMContentLoaded', renderLeaderboard);
    window.addEventListener('popstate', renderLeaderboard);
    
    const observer = new MutationObserver(() => {
        if (window.location.pathname.includes('/rankings')) {
            renderLeaderboard();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(renderLeaderboard, 1000);
})();
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

(function() {
  function initChatsongMedia() {
    
    // --- 1. SELECTEER ALLE BERICHTEN (Posts, DMs en Reacties) ---
    const messageContainers = document.querySelectorAll('.Post-body, .PrivateMessage-body, .MessageBody, .item-content');

    messageContainers.forEach(container => {
      
      // --- A. PLYR VIDEOSPELER (MP4) ---
      const fofElements = container.querySelectorAll('.ButtonGroup, .fof-upload-download, div[data-fof-upload-download-uuid]');
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
            if (uuid) videoSrc = window.location.origin + '/assets/files/' + uuid;
          }
          if (videoSrc) {
            el.dataset.plyrDone = "true";
            replaceWithPlyr(el, videoSrc);
          }
        }
      });

      const links = container.querySelectorAll('a[href*=".mp4"]');
      links.forEach(link => {
        if (link.dataset.plyrDone) return;
        link.dataset.plyrDone = "true";
        replaceWithPlyr(link, link.href);
      });

      // --- B. YOUTUBE SHORTS AUTOMATISCH EMBEDDEN ---
      const ytShortsLinks = container.querySelectorAll('a[href*="youtube.com/shorts/"], a[href*="youtu.be/"]');
      ytShortsLinks.forEach(link => {
        if (link.dataset.embedDone) return;
        
        let videoId = null;
        if (link.href.includes('/shorts/')) {
          videoId = link.href.split('/shorts/')[1].split('?')[0].split('/')[0];
        }

        if (videoId) {
          link.dataset.embedDone = "true";
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.style.cssText = 'width: 100%; max-width: 340px; height: 600px; border-radius: 12px; border: none; margin: 10px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.15);';
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          iframe.setAttribute('allowfullscreen', 'true');
          link.parentNode.replaceChild(iframe, link);
        }
      });

      // --- C. TIKTOK SHORTS AUTOMATISCH EMBEDDEN ---
      const tiktokLinks = container.querySelectorAll('a[href*="tiktok.com/"]');
      tiktokLinks.forEach(link => {
        if (link.dataset.embedDone) return;
        const matches = link.href.match(/video\/(\d+)/);
        if (matches && matches[1]) {
          const videoId = matches[1];
          link.dataset.embedDone = "true";
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.tiktok.com/embed/v2/${videoId}`;
          iframe.style.cssText = 'width: 100%; max-width: 325px; height: 580px; border-radius: 12px; border: none; margin: 10px 0;';
          link.parentNode.replaceChild(iframe, link);
        }
      });

      // --- D. SOUNDCLOUD LINKS AUTOMATISCH OMZETTEN NAAR INSLUITENDE SPELER ---
      const scLinks = container.querySelectorAll('a[href*="soundcloud.com/"]');
      scLinks.forEach(link => {
        if (link.dataset.scDone || link.closest('iframe') || link.closest('.AudioPlayer')) return;
        
        const href = link.href;
        if (href.includes('/') && href.split('/').length > 3) {
          link.dataset.scDone = "true";
          
          const iframe = document.createElement('iframe');
          iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(href)}&color=%238a2be2&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false`;
          iframe.style.cssText = 'width: 100%; max-width: 100%; height: 166px; border-radius: 12px; border: none; margin: 10px 0; background: transparent;';
          iframe.setAttribute('scrolling', 'no');
          iframe.setAttribute('frameborder', 'no');
          iframe.setAttribute('allow', 'autoplay');
          
          link.parentNode.replaceChild(iframe, link);
        }
      });

      // --- E. BESTAANDE SOUNDCLOUD & AUDIO FRAMES OPTIMALISEREN ---
      const scFrames = container.querySelectorAll('iframe[src*="soundcloud.com"], .MediaBox iframe, .AudioPlayer iframe');
      scFrames.forEach(frame => {
        frame.style.width = '100%';
        frame.style.maxWidth = '100%';
        frame.style.borderRadius = '12px';
        if (!frame.style.height || frame.style.height === '166px') {
          frame.style.height = '166px';
        }
      });
    });

    // --- 2. INSTAGRAM EMBEDS HERLADEN ---
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  }

  // Hulpfunctie voor Plyr
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

  // Luister naar normale lading én Flarum SPA navigatie
  document.addEventListener('DOMContentLoaded', initChatsongMedia);
  window.addEventListener('flarum:page:changed', initChatsongMedia);

  const observer = new MutationObserver(initChatsongMedia);
  window.addEventListener('load', () => {
    const target = document.getElementById('app') || document.body;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  });
})();

chrome.commands.onCommand.addListener((command) => {
  if (command === "copy_url") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.storage.sync.get('snackbarPosition', (data) => {
        const position = data.snackbarPosition || "bottom-center";
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (url, position) => {
            navigator.clipboard.writeText(url).then(() => {
              showArcSonner("URL copied!", "success", position);
            }).catch((err) => {
              console.error("Copy failed", err);
              showArcSonner("❌ Failed to copy URL", "error", position);
            });

            function showArcSonner(message, type = "success", position = "bottom-center") {
              // Create sonner container if it doesn't exist
              let sonnerContainer = document.getElementById('arc-sonner-container');
              if (!sonnerContainer) {
                sonnerContainer = document.createElement('div');
                sonnerContainer.id = 'arc-sonner-container';
                sonnerContainer.style.cssText = `
                  position: fixed;
                  ${position.includes("top") ? "top: 20px;" : "bottom: 20px;"}
                  ${position.includes("left") ? "left: 20px;" : position.includes("right") ? "right: 20px;" : "left: 50%; transform: translateX(-50%);"}
                  z-index: 10000;
                  pointer-events: none;
                  display: flex;
                  flex-direction: ${position.includes("top") ? "column" : "column-reverse"};
                  gap: 8px;
                  max-width: 420px;
                  width: auto;
                `;
                document.body.appendChild(sonnerContainer);
              }

              // Create the toast
              const toast = document.createElement('div');
              const toastId = 'toast-' + Date.now();
              toast.id = toastId;

              // Arc browser color scheme
              const colors = {
                success: {
                  bg: '#1a1a1a',
                  border: '#2a2a2a',
                  icon: '#00d084',
                  text: '#ffffff'
                },
                error: {
                  bg: '#1a1a1a',
                  border: '#2a2a2a',
                  icon: '#ff4757',
                  text: '#ffffff'
                }
              };

              const colorScheme = colors[type] || colors.success;

              toast.innerHTML = `
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  padding: 14px 16px;
                  background: ${colorScheme.bg};
                  border: 1px solid ${colorScheme.border};
                  border-radius: 10px;
                  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
                  backdrop-filter: blur(20px);
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  font-size: 14px;
                  font-weight: 500;
                  color: ${colorScheme.text};
                  min-width: 200px;
                  max-width: 400px;
                  pointer-events: auto;
                  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                  transform: translateY(${position.includes("top") ? "-" : ""}100%);
                  opacity: 0;
                ">
                  <div style="
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: ${colorScheme.icon};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 12px;
                  ">
                    ${type === 'success' ? '✓' : '✕'}
                  </div>
                  <span style="flex: 1; line-height: 1.4;">${message}</span>
                  <button onclick="this.closest('[id^=toast-]').remove()" style="
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                    font-size: 14px;
                    line-height: 1;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  " onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#fff';" onmouseout="this.style.background='none'; this.style.color='#888';">×</button>
                </div>
              `;

              sonnerContainer.appendChild(toast);

              // Animate in
              requestAnimationFrame(() => {
                const toastElement = toast.firstElementChild;
                toastElement.style.transform = 'translateY(0)';
                toastElement.style.opacity = '1';
              });

              setTimeout(() => {
                const toastElement = document.getElementById(toastId);
                if (toastElement) {
                  const inner = toastElement.firstElementChild;
                  inner.style.transform = `translateY(${position.includes("top") ? "-" : ""}100%)`;
                  inner.style.opacity = '0';
                  setTimeout(() => {
                    toastElement.remove();
                    // Clean up container if empty
                    if (sonnerContainer.children.length === 0) {
                      sonnerContainer.remove();
                    }
                  }, 300);
                }
              }, 1000);
            }
          },
          args: [tab.url, position]
        });
      });
    });
  }
});
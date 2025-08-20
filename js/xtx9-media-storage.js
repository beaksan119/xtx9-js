document.addEventListener('DOMContentLoaded', () => {
    const mediaContainer = document.getElementById('sf-media-storage');
    const jsonUrl = `https://beaksan119.pages.dev/pub/xtx9-media-storage.json?v=${new Date().getTime()}`;
    const imageDomain = 'https://xtx9.pages.dev/'; // JSON에 이미 있지만 만약을 위해 정의

    // JSON 데이터 가져오기
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 로딩 메시지 제거
            mediaContainer.innerHTML = ''; 
            
            // 모든 이미지 파일을 재귀적으로 찾기
            const allImages = extractImages(data.tree);

            // 이미지 리스트 렌더링
            renderImages(allImages);
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            mediaContainer.innerHTML = `<p style="color: #ff6b6b; text-align: center;">데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.</p>`;
        });

    /**
     * JSON 트리 구조에서 모든 이미지 객체를 재귀적으로 추출하는 함수
     * @param {object} node - 현재 트리 노드 (폴더 또는 파일)
     * @returns {Array} - 이미지 객체의 배열
     */
    function extractImages(node) {
        let images = [];
        if (node && node.children) {
            for (const child of node.children) {
                if (child.type === 'img') {
                    images.push(child);
                } else if (child.type === 'folder') {
                    images = images.concat(extractImages(child)); // 재귀 호출
                }
            }
        }
        return images;
    }

    /**
     * 이미지 객체 배열을 받아 HTML 요소를 생성하고 화면에 표시하는 함수
     * @param {Array} images - 이미지 객체 배열
     */
    function renderImages(images) {
        if (images.length === 0) {
            mediaContainer.innerHTML = '<p>표시할 이미지가 없습니다.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();

        images.forEach(image => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            mediaItem.title = `[클릭하여 URL 복사]\n파일: ${image.filename}\n해상도: ${image.resolution}\n크기: ${(image.size / 1024).toFixed(2)} KB`;

            const img = document.createElement('img');
            img.src = image.thumburl; // 썸네일 URL 사용
            img.alt = image.filename;
            img.loading = 'lazy'; // 이미지 지연 로딩

            const filenameDiv = document.createElement('div');
            filenameDiv.className = 'filename';
            filenameDiv.textContent = image.name;

            mediaItem.appendChild(img);
            mediaItem.appendChild(filenameDiv);
            
            // 클릭 시 원본 이미지 URL 복사 이벤트 추가
            mediaItem.addEventListener('click', () => {
                copyToClipboard(image.url);
            });
            
            fragment.appendChild(mediaItem);
        });

        mediaContainer.appendChild(fragment);
    }

    /**
     * 텍스트를 클립보드에 복사하고 사용자에게 알림을 표시하는 함수
     * @param {string} text - 복사할 텍스트 (이미지 URL)
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification('이미지 URL이 복사되었습니다!');
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
            showCopyNotification('복사에 실패했습니다.', true);
        });
    }

    /**
     * 화면에 알림 메시지를 잠시 보여주는 함수
     * @param {string} message - 표시할 메시지
     * @param {boolean} isError - 에러 메시지 여부
     */
    function showCopyNotification(message, isError = false) {
        // 기존 알림이 있다면 제거
        const existingNotif = document.querySelector('.copy-notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        if(isError) {
            notification.style.backgroundColor = '#e74c3c';
        }
        document.body.appendChild(notification);

        // 애니메이션 효과
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // 2초 후 사라짐
        setTimeout(() => {
            notification.classList.remove('show');
            // 애니메이션 종료 후 요소 제거
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }
});
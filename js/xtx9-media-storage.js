class SfMediaStorage {
    /**
     * @param {string} containerSelector - 미디어 리스트를 표시할 컨테이너의 CSS 선택자
     */
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.jsonUrl = 'https://beaksan119.pages.dev/pub/xtx9-media-storage.json';
        
        if (!this.container) {
            console.error(`'${containerSelector}' 선택자에 해당하는 요소를 찾을 수 없습니다.`);
            return;
        }

        this.init();
    }

    /**
     * 클래스 초기화 및 데이터 로딩 시작
     */
    async init() {
        this.showLoading();
        try {
            const data = await this.fetchData();
            const allImages = this._extractImages(data.tree);
            this.renderImages(allImages);
        } catch (error) {
            console.error('Error initializing SfMediaStorage:', error);
            this.showError('미디어를 불러오는 데 실패했습니다.');
        }
    }

    /**
     * JSON 데이터를 서버에서 가져옵니다.
     * @returns {Promise<object>} - 파싱된 JSON 데이터
     */
    async fetchData() {
        const urlWithCacheBuster = `${this.jsonUrl}?v=${new Date().getTime()}`;
        const response = await fetch(urlWithCacheBuster);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * 화면에 로딩 메시지를 표시합니다.
     */
    showLoading() {
        this.container.innerHTML = `<p class="loading-message">미디어를 불러오는 중입니다...</p>`;
    }

    /**
     * 화면에 오류 메시지를 표시합니다.
     * @param {string} message - 표시할 오류 메시지
     */
    showError(message) {
        this.container.innerHTML = `<p style="color: #ff6b6b; text-align: center;">${message}</p>`;
    }

    /**
     * 이미지 객체 배열을 받아 HTML 요소를 생성하고 화면에 렌더링합니다.
     * @param {Array<object>} images - 이미지 객체 배열
     */
    renderImages(images) {
        this.container.innerHTML = ''; // 로딩 메시지 제거

        if (images.length === 0) {
            this.container.innerHTML = '<p>표시할 이미지가 없습니다.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();

        images.forEach(image => {
            const mediaItem = this._createMediaElement(image);
            fragment.appendChild(mediaItem);
        });

        this.container.appendChild(fragment);
    }
    
    /**
     * 개별 미디어 아이템 HTML 요소를 생성합니다.
     * @param {object} image - 개별 이미지 데이터
     * @returns {HTMLElement} - 생성된 div.media-item 요소
     */
    _createMediaElement(image) {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.title = `[클릭하여 URL 복사]\n파일: ${image.filename}\n해상도: ${image.resolution}\n크기: ${(image.size / 1024).toFixed(2)} KB`;

        const img = document.createElement('img');
        img.src = image.thumburl;
        img.alt = image.filename;
        img.loading = 'lazy';

        const filenameDiv = document.createElement('div');
        filenameDiv.className = 'filename';
        filenameDiv.textContent = image.name;

        mediaItem.appendChild(img);
        mediaItem.appendChild(filenameDiv);
        
        mediaItem.addEventListener('click', () => {
            this.copyToClipboard(image.url);
        });
        
        return mediaItem;
    }

    /**
     * JSON 트리 구조에서 모든 이미지 객체를 재귀적으로 추출합니다.
     * @private
     * @param {object} node - 현재 트리 노드 (폴더 또는 파일)
     * @returns {Array<object>} - 이미지 객체의 배열
     */
    _extractImages(node) {
        let images = [];
        if (node && node.children) {
            for (const child of node.children) {
                if (child.type === 'img') {
                    images.push(child);
                } else if (child.type === 'folder') {
                    images = images.concat(this._extractImages(child));
                }
            }
        }
        return images;
    }

    /**
     * 텍스트를 클립보드에 복사하고 사용자에게 알림을 표시합니다.
     * @param {string} text - 복사할 텍스트 (이미지 URL)
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this._showCopyNotification('이미지 URL이 복사되었습니다!');
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
            this._showCopyNotification('복사에 실패했습니다.', true);
        });
    }

    /**
     * 화면에 알림 메시지를 잠시 보여줍니다.
     * @private
     * @param {string} message - 표시할 메시지
     * @param {boolean} isError - 에러 메시지 여부
     */
    _showCopyNotification(message, isError = false) {
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

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 2000);
    }
}

// ===================================================================
// 스크립트 실행 시점과 관계없이 안전하게 클래스 인스턴스를 생성하는 로직
// ===================================================================
const initializeMediaStorage = () => {
    new SfMediaStorage('#sf-media-storage');
};

if (document.readyState === 'loading') {
    // 문서가 아직 로딩 중이면, DOMContentLoaded 이벤트를 기다립니다.
    document.addEventListener('DOMContentLoaded', initializeMediaStorage);
} else {
    // 문서가 이미 로드되었다면 (interactive 또는 complete 상태), 즉시 함수를 실행합니다.
    initializeMediaStorage();
}
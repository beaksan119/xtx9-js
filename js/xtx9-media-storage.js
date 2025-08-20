document.addEventListener('DOMContentLoaded', () => {
    const storageContainer = document.getElementById('sf-media-storage');
    const jsonUrl = 'https://beaksan119.pages.dev/pub/xtx9-media-storage.json';
    
    if (!storageContainer) {
        console.error('Error: Target container #sf-media-storage not found.');
        return;
    }

    /**
     * JSON 데이터를 가져와서 UI를 렌더링하는 메인 함수
     */
    async function loadMedia() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 중첩된 폴더 구조에서 모든 이미지 파일만 추출
            const allImages = extractImagesFromTree(data.tree);

            // 추출한 이미지 리스트를 화면에 렌더링
            renderImages(allImages);

        } catch (error) {
            console.error('Failed to load or process media data:', error);
            storageContainer.innerHTML = `<div class="error-message">데이터를 불러오는 데 실패했습니다.</div>`;
        }
    }

    /**
     * 재귀 함수: 중첩된 트리 구조를 탐색하여 모든 이미지 객체를 배열로 반환
     * @param {object} node - 현재 탐색 중인 노드 (폴더 또는 파일)
     * @returns {Array} - 이미지 객체들의 배열
     */
    function extractImagesFromTree(node) {
        let images = [];

        // 현재 노드가 이미지 타입이면 배열에 추가
        if (node.type === 'img') {
            images.push(node);
        }

        // 현재 노드가 자식(children)을 가지고 있으면 (즉, 폴더라면)
        if (node.children && node.children.length > 0) {
            // 각 자식에 대해 재귀적으로 함수를 호출하고 결과를 합침
            for (const child of node.children) {
                images = images.concat(extractImagesFromTree(child));
            }
        }
        
        return images;
    }

    /**
     * 이미지 배열을 받아서 HTML 요소를 생성하고 컨테이너에 추가
     * @param {Array} images - 렌더링할 이미지 객체 배열
     */
    function renderImages(images) {
        // 로딩 인디케이터 제거
        storageContainer.innerHTML = '';
        
        if (images.length === 0) {
            storageContainer.innerHTML = `<div class="info-message">표시할 이미지가 없습니다.</div>`;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'media-grid';

        images.forEach(image => {
            // 각 이미지를 위한 HTML 요소 생성
            const item = document.createElement('div');
            item.className = 'media-item';

            // 이미지 원본 링크
            const link = document.createElement('a');
            link.href = image.url; // 원본 이미지 URL
            link.target = '_blank'; // 새 탭에서 열기
            link.rel = 'noopener noreferrer';
            
            // 썸네일 이미지
            const img = document.createElement('img');
            img.src = image.thumburl; // 썸네일 이미지 URL
            img.alt = image.filename;
            img.loading = 'lazy'; // 이미지 지연 로딩으로 성능 향상

            // 파일 이름
            const filename = document.createElement('div');
            filename.className = 'filename';
            filename.textContent = image.filename;
            filename.title = image.filename; // 마우스를 올리면 전체 파일 이름 표시

            // 요소들을 조립
            link.appendChild(img);
            item.appendChild(link);
            item.appendChild(filename);
            
            grid.appendChild(item);
        });

        storageContainer.appendChild(grid);
    }

    // 미디어 로드 함수 실행
    loadMedia();
});
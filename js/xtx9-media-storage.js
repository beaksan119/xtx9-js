// xtx9-media-storage.js

/**
 * 즉시 실행 함수(IIFE)를 사용하여 전역 스코프의 오염을 방지합니다.
 */
(() => {
  // DOM이 완전히 로드된 후 스크립트를 실행합니다.
  document.addEventListener('DOMContentLoaded', () => {

    // --- 설정 변수 ---
    const config = {
      // 데이터를 가져올 JSON 파일의 URL
      jsonUrl: 'https://beaksan119.pages.dev/pub/xtx9-media-storage.json',
      // 이미지가 저장된 기본 도메인 URL
      imageBaseUrl: 'https://xtx9.pages.dev/',
      // 이미지를 표시할 HTML 요소의 ID
      targetElementId: 'sf-media-storage'
    };

    /**
     * 미디어를 로드하고 화면에 렌더링하는 비동기 함수
     */
    async function loadMedia() {
      // 이미지를 표시할 컨테이너 요소를 가져옵니다.
      const container = document.getElementById(config.targetElementId);

      // 컨테이너 요소가 없으면 오류를 출력하고 함수를 종료합니다.
      if (!container) {
        console.error(`[Error] Target element with ID "${config.targetElementId}" not found.`);
        return;
      }

      try {
        // fetch API를 사용하여 JSON 데이터를 비동기적으로 가져옵니다.
        const response = await fetch(config.jsonUrl);
        
        // 응답이 성공적이지 않으면 오류를 발생시킵니다.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 응답 본문을 JSON으로 파싱합니다. (이미지 경로 문자열 배열)
        const imagePaths = await response.json();

        // 컨테이너의 기존 내용을 비웁니다.
        container.innerHTML = '';

        // 이미지 경로 배열을 순회하며 각 이미지를 화면에 추가합니다.
        imagePaths.forEach(path => {
          // 전체 이미지 URL을 생성합니다.
          const imageUrl = config.imageBaseUrl + path;
          
          // 이미지를 감싸는 div 요소를 생성합니다. (스타일링 용이)
          const mediaItem = document.createElement('div');
          mediaItem.className = 'media-item'; // CSS 스타일링을 위한 클래스 추가

          // img 요소를 생성합니다.
          const img = document.createElement('img');
          img.src = imageUrl; // 이미지 소스 설정
          img.alt = path.split('/').pop(); // 파일명을 alt 텍스트로 사용 (웹 접근성)
          img.loading = 'lazy'; // 이미지 지연 로딩으로 성능 최적화

          // 생성한 img를 div에 추가합니다.
          mediaItem.appendChild(img);

          // 완성된 div를 메인 컨테이너에 추가합니다.
          container.appendChild(mediaItem);
        });

      } catch (error) {
        // 데이터 로딩 중 오류가 발생하면 콘솔에 오류를 출력하고
        // 사용자에게 오류 메시지를 표시합니다.
        console.error('Failed to load media storage:', error);
        if (container) {
          container.innerHTML = '<p class="error-message">이미지를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.</p>';
        }
      }
    }

    // 미디어 로드 함수를 호출하여 실행합니다.
    loadMedia();
  });
})();
document.addEventListener('DOMContentLoaded', () => {
    const mediaContainer = document.getElementById('sf-media-storage');
    const jsonUrl = `https://beaksan119.pages.dev/pub/xtx9-media-storage.json?v=${new Date().getTime()}`;

    // JSON 데이터를 텍스트 형태로 가져오기
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // .json() 대신 .text()를 사용하여 원본 텍스트를 그대로 받습니다.
            return response.text();
        })
        .then(textData => {
            // 로딩 메시지 제거
            mediaContainer.innerHTML = ''; 
            
            // <pre> 태그를 사용하여 JSON 텍스트의 형식을 유지하며 출력합니다.
            const preElement = document.createElement('pre');
            preElement.style.whiteSpace = 'pre-wrap'; // 긴 줄이 자동으로 줄바꿈되도록 설정
            preElement.style.wordBreak = 'break-all'; // 단어가 길어도 강제로 줄바꿈
            preElement.style.padding = '15px';
            preElement.style.backgroundColor = '#282c34';
            preElement.style.color = '#abb2bf';
            preElement.style.borderRadius = '5px';
            preElement.textContent = textData;
            
            mediaContainer.appendChild(preElement);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            mediaContainer.innerHTML = `<p style="color: #ff6b6b; text-align: center;">데이터를 불러오는 데 실패했습니다: ${error.message}</p>`;
        });
});
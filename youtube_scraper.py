import requests
from bs4 import BeautifulSoup

def get_youtube_video_links(channel_url):
    """
    YouTube 채널 페이지에서 영상 링크를 추출합니다.
    """
    try:
        response = requests.get(channel_url)
        response.raise_for_status()  # HTTP 에러 발생 시 예외를 발생

        soup = BeautifulSoup(response.text, 'html.parser')

        # 영상 링크를 포함하는 태그를 찾습니다. 이 부분은 YouTube 페이지 구조에 따라 변경될 수 있습니다.
        video_links = []
        for a_tag in soup.find_all('a', {'id': 'thumbnail'}):
            video_url = "https://www.youtube.com" + a_tag['href']
            video_links.append(video_url)

        return video_links

    except requests.exceptions.RequestException as e:
        print(f"오류 발생: {e}")
        return None

if __name__ == "__main__":
    channel_url = "https://www.youtube.com/@nuleong/videos"  # 채널 URL을 입력하세요
    video_links = get_youtube_video_links(channel_url)

    if video_links:
        print("YouTube 영상 링크:")
        for link in video_links:
            print(link)
    else:
        print("영상 링크를 가져오지 못했습니다.")

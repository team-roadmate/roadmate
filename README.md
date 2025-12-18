# 🗺️ 로드메이트 (RoadMate) - 프론트엔드

> **"당신의 산책이 즐거워지는 순간"** > 서울시 도보네트워크 공공데이터를 활용한 실시간 산책 경로 안내 어플리케이션

---

## 📝 프로젝트 소개
**로드메이트(RoadMate)**는 목적지까지의 최단 거리 안내는 물론, 산책의 즐거움을 더하기 위한 **타원형 루프 경로** 추천 기능을 제공하는 산책 특화 서비스입니다. 서울시의 정밀한 도보 네트워크 데이터를 기반으로 안전하고 편리한 보행 경로를 실시간으로 안내합니다.

본 프로젝트는 **'공공데이터를 활용한 웹서버 개발대회'** 참여 작품입니다.

## ✨ 주요 기능
- **📍 정밀 보행 경로 안내**: 서울시 도보네트워크 데이터를 활용한 상세 경로 탐색
- **🔄 맞춤형 루프 경로**: 사용자 위치 기반의 타원형 산책 루프 경로 생성 및 제안
- **🧭 실시간 네비게이션**: `expo-location`을 활용한 사용자 실시간 위치 추적 및 안내
- **🌤️ 환경 정보 제공**: 산책 전 현재 날씨 정보를 실시간으로 확인 (조회 기능)
- **💾 경로 히스토리 관리**: 즐겨 찾는 산책로 및 최근 경로 저장 기능

## 🛠 기술 스택
### Frontend
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Map Service**: React Native Maps
- **Communication**: Axios

### Design & Tools
- **UI Framework**: React Native Paper (또는 사용하신 라이브러리)
- **Build Tool**: Expo Go

## 🚀 시작하기

### 사전 준비 (Prerequisites)
- [Node.js](https://nodejs.org/) 설치
- [Expo Go](https://expo.dev/client) 앱 설치 (모바일 확인용)

### 설치 및 실행
1. 의존성 라이브러리를 설치합니다.

```bash
npm install
# 또는
yarn install

```

2. 프로젝트를 실행합니다.

```bash
npx expo start

```

3. QR 코드를 스캔하여 Expo Go 앱에서 실행하거나, 시뮬레이터를 통해 확인합니다.

## 🏛️ 시스템 구조 (Architecture)

* **Client**: React Native Expo 기반 모바일 인터페이스
* **API**: 서울시 도보네트워크 API, 기상청 단기예보 API
* **Server**: Spring Boot 백엔드 서버와 RESTful 통신

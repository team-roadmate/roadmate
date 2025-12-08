export async function fetchRoute(start: string, end: string) {
  // 실제 API URL로 바꿔야 함
  const res = await fetch(`https://api.example.com/route?start=${start}&end=${end}`);
  return res.json();
}

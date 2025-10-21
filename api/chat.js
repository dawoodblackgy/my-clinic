// ملف: api/chat.js
export default async function handler(req, res) {
  // تمكين CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      
      console.log('Received message:', message);

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-36f114d6582e4c7a8cd3d2c7fb998d53'
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `أنت مساعد طبي في مجمع عيادات عربي. 
أجب على أي سؤال باللغة العربية بطريقة مفيدة وودودة.
ساعد في: معلومات طبية عامة، توجيه للعيادات، نصائح صحية، استفسارات عن الخدمات.
كن دقيقاً ومفيداً واجعل الردود طويلة ومفيدة.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const botResponse = data.choices[0]?.message?.content || 'شكراً لسؤالك!';

      res.status(200).json({ response: botResponse });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        response: 'عذراً، حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
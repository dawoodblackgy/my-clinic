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
      
      console.log('📨 Received message:', message);

      // تحقق من وجود الرسالة
      if (!message) {
        return res.status(400).json({ response: 'الرسالة فارغة' });
      }

      // 💡 ملاحظة أمنية: من الأفضل تخزين مفتاح الـ API في متغيرات البيئة
      // const apiKey = process.env.OPENAI_API_KEY;
      const apiKey = 'sk-36f114d6582e4c7a8cd3d2c7fb998d53'; // المفتاح الحالي للتجربة

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `أنت مساعد طبي في مجمع عيادات عربي. 
ساعد في معلومات طبية عامة، توجيه للعيادات، نصائح صحية.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      console.log('🔧 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        
        // استخدم ردود محلية إذا فشل الـ API
        return res.status(200).json({ 
          response: getLocalResponse(message) 
        });
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      
      const botResponse = data.choices[0]?.message?.content || 'شكراً لسؤالك!';

      res.status(200).json({ response: botResponse });
      
    } catch (error) {
      console.error('💥 Catch Error:', error);
      
      // دائماً نرجع 200 مع رد محلي
      res.status(200).json({ 
        response: getLocalResponse(req.body?.message || '') 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// نظام ردود محلي ذكي
function getLocalResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    'مرحبا': 'أهلاً وسهلاً! 🌟 أنا مساعد العيادة الافتراضي. كيف يمكنني مساعدتك اليوم؟',
    'اهلا': 'أهلاً وسهلاً! 😊 أنا هنا لمساعدتك في استفساراتك الطبية.',
    'السلام عليكم': 'وعليكم السلام ورحمة الله! 🙏 كيف يمكنني خدمتك؟',
    
    'عيادات': `🏥 **عياداتنا المتوفرة:**
• 🦷 عيادة الأسنان - علاجات متكاملة
• 👶 عيادة الأطفال - رعاية شاملة  
• 🩺 عيادة الجلدية - عناية بالبشرة
• ❤️ عيادة الباطنة - أمراض داخلية
• 👁️ عيادة العيون - فحوصات متقدمة

أي عيادة تريد معرفة المزيد عنها؟`,

    'اسنان': `🦷 **عيادة الأسنان:**
• تنظيف وفحص دوري
• حشوات تجميلية  
• تبييض الأسنان
• تقويم الأسنان
• علاج الجذور

📞 للحجز: 966123456789`,

    'اطفال': `👶 **عيادة الأطفال:**
• فحوصات النمو
• التطعيمات الأساسية
• علاج الأمراض الشائعة
• استشارات التغذية

🕐 متاح من 8 صباحاً حتى 8 مساءً`,

    'حجز': `📅 **لحجز موعد:**
1. 📞 هاتفياً: 966123456789
2. 🌐 أونلاين: املأ نموذج الحجر
3. 🏥 حضورياً: تفضل بزيارتنا

أي عيادة تريد الحجز فيها؟`,

    'رقم': `📞 **اتصل بنا:**
• الهاتف: 966123456789
• الواتساب: 966123456789  
• الطوارئ: 966123456789

⏰ متاحون 24/7 للطوارئ`,

    'عنوان': `📍 **عنوان المجمع:**
مجمع عيادات [اسم المجمع]
الرياض - حي العليا - شارع الملك فهد

🗺️ مواقف مجانية - سهولة الوصول`,

    'طوارئ': `🚨 **للحالات الطارئة:**
• هاتف الطوارئ: 966123456789 (24/7)
• داخل أوقات العمل: تفضل بالحضور فوراً
• للحالات الحرجة: توجه لأقرب مستشفى`,

    'default': `🤖 **مساعد العيادة الافتراضي**

أهلاً بك! للأسف الخدمة الذكية غير متاحة حالياً.

لكن يمكنني مساعدتك في:
🏥 معلومات العيادات
📅 حجز المواعيد  
📞 الاتصال بنا
💊 نصائح طبية عامة

📞 **اتصل بنا على: 966123456789**`
  };

  // البحث عن أفضل رد
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  return responses['default'];
}

// نظام ردود محلي ذكي كحل احتياطي
function getLocalResponse(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  const responses = {
    'مرحبا': 'أهلاً وسهلاً! 🌟 أنا مساعد العيادة الافتراضي. كيف يمكنني مساعدتك اليوم؟',
    'اهلا': 'أهلاً وسهلاً! 😊 أنا هنا لمساعدتك في استفساراتك الطبية.',
    'السلام عليكم': 'وعليكم السلام ورحمة الله! 🙏 كيف يمكنني خدمتك؟',
    
    'عيادات': `🏥 **عياداتنا المتوفرة:**
• 🦷 عيادة الأسنان - علاجات متكاملة
• 👶 عيادة الأطفال - رعاية شاملة  
• 🩺 عيادة الجلدية - عناية بالبشرة
• ❤️ عيادة الباطنة - أمراض داخلية
• 👁️ عيادة العيون - فحوصات متقدمة

أي عيادة تريد معرفة المزيد عنها؟`,

    'اسنان': `🦷 **عيادة الأسنان:**
• تنظيف وفحص دوري
• حشوات تجميلية  
• تبييض الأسنان
• تقويم الأسنان
• علاج الجذور

📞 للحجز: 966123456789`,

    'اطفال': `👶 **عيادة الأطفال:**
• فحوصات النمو
• التطعيمات الأساسية
• علاج الأمراض الشائعة
• استشارات التغذية

🕐 متاح من 8 صباحاً حتى 8 مساءً`,

    'حجز': `📅 **لحجز موعد:**
1. 📞 هاتفياً: 966123456789
2. 🌐 أونلاين: املأ نموذج الحجز على موقعنا
3. 🏥 حضورياً: تفضل بزيارتنا

أي عيادة تريد الحجز فيها؟`,

    'رقم': `📞 **اتصل بنا:**
• الهاتف: 966123456789
• الواتساب: 966123456789  
• الطوارئ: 966123456789

⏰ متاحون 24/7 للطوارئ`,

    'عنوان': `📍 **عنوان المجمع:**
مجمع عيادات [اسم المجمع]
الرياض - حي العليا - شارع الملك فهد

🗺️ مواقف مجانية - سهولة الوصول`,

    'طوارئ': `🚨 **للحالات الطارئة:**
• هاتف الطوارئ: 966123456789 (24/7)
• داخل أوقات العمل: تفضل بالحضور فوراً
• للحالات الحرجة: توجه لأقرب مستشفى`,

    'default': `🤖 **مساعد العيادة الافتراضي**

أهلاً بك! للأسف الخدمة الذكية غير متاحة حالياً.

لكن يمكنني مساعدتك في:
🏥 معلومات العيادات
📅 حجز المواعيد  
📞 الاتصال بنا

📞 **اتصل بنا على: 966123456789**`
  };

  // البحث عن أفضل رد
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  return responses['default'];
}

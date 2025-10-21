document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotBox = document.getElementById('chatbot-box');
    const closeChatbotBtn = document.getElementById('close-chatbot');

    if (chatbotToggle && chatbotBox && closeChatbotBtn) {
        console.log('Chatbot elements found');
        
        chatbotToggle.addEventListener('click', () => {
            console.log('Toggle button clicked');
            chatbotBox.classList.toggle('active');
        });

        closeChatbotBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotBox.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
            if (!chatbotBox.contains(e.target) && !chatbotToggle.contains(e.target)) {
                chatbotBox.classList.remove('active');
            }
        });

        chatbotBox.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    } else {
        console.error('Chatbot toggle elements not found!');
    }

    // --- Appointment Form ---
    const appointmentForm = document.querySelector('.appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form Submitted!');
            const formData = new FormData(this);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            console.log(data);

            alert('تم استلام طلب حجزك بنجاح! سنتواصل معك قريباً.');
            this.reset();
        });
    }

    // Chatbot messaging system
    const chatBody = document.getElementById('chatbot-body');
    const chatInput = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');

    // استبدل دالة getAIResponse بالكود الجديد:
    async function getAIResponse(userMessage) {
        try {
            // استخدم المسار المطلق للـ API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.response;
            } else {
                throw new Error(`Server Error: ${response.status}`);
            }
            
        } catch (error) {
            console.error('API Error:', error);
            return getEnhancedResponse(userMessage);
        }
    }


    // دالة الردود المحلية (نسخة احتياطية)
    function getSmartResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            'مرحبا': 'مرحباً بك! 🌟 أنا المساعد الافتراضي لمجمع العيادات. كيف يمكنني مساعدتك اليوم؟',
            'اهلا': 'أهلاً وسهلاً! 😊 أنا هنا لمساعدتك في استفساراتك الطبية وحجز المواعيد.',
            'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! 🙏 كيف يمكنني خدمتك اليوم؟',
            'اهلا وسهلا': 'أهلاً وسهلاً بك! 🌸 نحن سعداء بخدمتك. ما الذي تبحث عنه؟',
            
            'عيادات': `🏥 **عياداتنا المتوفرة:**
• 🦷 عيادة الأسنان
• 👶 عيادة الأطفال  
• 🩺 عيادة الجلدية
• ❤️ عيادة الباطنة
• 👁️ عيادة العيون

أي عيادة تريد معرفة المزيد عنها؟`,

            'اسنان': `🦷 **عيادة الأسنان:**
• تنظيف وفحص دوري
• حشوات تجميلية
• تبييض الأسنان
• تقويم الأسنان
• علاج الجذور
• زراعة الأسنان

🕐 **المواعيد:** من السبت إلى الخميس - 9 صباحاً إلى 9 مساءً`,

            'اطفال': `👶 **عيادة الأطفال:**
• فحوصات النمو والتطور
• التطعيمات الأساسية
• علاج الأمراض الشائعة
• استشارات الرضاعة والتغذية
• متابعة حديثي الولادة

👩‍⚕️ **الدكتورة سارة علي** - متخصصة في طب الأطفال`,

            'جلدية': `🩺 **عيادة الجلدية:**
• علاج حب الشباب
• الأمراض الجلدية المزمنة
• العناية بالبشرة
• إزالة الشامات والزوائد
• علاج تساقط الشعر

👨‍⚕️ **الدكتور أحمد محمد** - استشاري الأمراض الجلدية
🕐 **المواعيد:** الأحد إلى الخميس - 11 صباحاً إلى 7 مساءً`,

            'خدمات': `💊 **خدماتنا الطبية:**
• 🔬 فحوصات طبية دورية شاملة
• 🩺 استشارات طبية متخصصة
• ✂️ إجراءات جراحية بسيطة
• 🧪 تحاليل مخبرية متكاملة
• 📷 أشعة تشخيصية متقدمة
• 💉 تطعيمات ووقاية

أي خدمة تريد الاستفسار عنها؟`,

            'حجز': `📅 **طرق حجز الموعد:**
1. 📞 **هاتفياً:** 966123456789
2. 🌐 **أونلاين:** املأ نموذج الحجز
3. 🏥 **حضورياً:** تفضل بزيارتنا

أي عيادة تريد الحجز فيها؟`,

            'موعد': `🕐 **مواعيد العمل:**
• الأحد - الخميس: 8:00 صباحاً - 10:00 مساءً
• الجمعة: 4:00 مساءً - 10:00 مساءً
• السبت: 9:00 صباحاً - 6:00 مساءً

لحجز موعد، اختر العيادة المطلوبة`,

            'رقم': `📞 **اتصل بنا:**
• الهاتف: 966123456789
• الواتساب: 966123456789
• للطوارئ: 966123456789`,

            'عنوان': `📍 **عنوان المجمع:**
[عنوان مجمع العيادات]
الرياض - حي العليا - شارع الملك فهد

🗺️ يمكنك استخدام خرائط جوجل للوصول إلينا`,

            'اين العنوان': `🏥 **موقعنا:**
[عنوان مجمع العيادات]
سهولة الوصول ومواقف مجانية للسيارات

📱 للاتصال: 966123456789`,

            'سعر': `💵 **الأسعار:**
• تختلف حسب الخدمة والعيادة
• لدينا باقات وعروض خاصة
• نقدم خصومات للكشف الدوري

📞 للاستفسار: 966123456789`,

            'اسعار': `💵 **الأسعار:**
• تختلف حسب الخدمة والعيادة
• لدينا باقات وعروض خاصة
• نقدم خصومات للكشف الدوري

📞 للاستفسار عن الأسعار: 966123456789
🎯 أو يمكنك زيارة العيادة لمعرفة التفاصيل`,

            'طوارئ': `🚨 **للحالات الطارئة:**
• هاتف الطوارئ: 966123456789
• داخل أوقات العمل: تفضل بالحضور فوراً`,

            'شكرا': `العفو! 🌟 دائماً سعيد بمساعدتك.
هل هناك شيء آخر تريد معرفته؟`,

            'ممتاز': `شكراً لك! 😊 هذا يشجعنا على تقديم الأفضل.
كيف يمكنني مساعدتك أكثر؟`,

            'default': `🤔 لم أفهم سؤالك تماماً...

يمكنني مساعدتك في:
🏥 **معلومات العيادات**
📅 **حجز المواعيد**  
📞 **الاتصال بنا**
💊 **الخدمات الطبية**

ما الذي تريد معرفته؟`
        };

        // البحث عن أفضل رد
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        return responses['default'];
    }

    // الخطوة 2: أضف دالة الردود المحلية المحسنة:
    function getEnhancedResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // نظام ردود أذكى وأكثر مرونة
        const responses = {
            // التحية
            'مرحبا': 'مرحباً بك! 🌟 أنا المساعد الافتراضي لمجمع العيادات. أسألني عن أي شيء: عياداتنا، خدماتنا، حجز المواعيد، أو استفسارات طبية عامة.',
            'اهلا': 'أهلاً وسهلاً! 😊 أنا هنا لمساعدتك في أي استفسار طبي أو خدمي. كيف يمكنني خدمتك اليوم؟',
            'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! 🙏 كيف يمكنني مساعدتك اليوم؟',
            
            // أسئلة عامة
            'من انت': 'أنا المساعد الافتراضي لمجمع العيادات! 🤖 مهمتي مساعدتك في الاستفسارات الطبية، معلومات العيادات، حجز المواعيد، وأي أسئلة أخرى.',
            'ما اسمك': 'أنا المساعد الافتراضي للعيادة! يمكنك مناداتي بأي اسم تفضله. كيف يمكنني مساعدتك؟',
            'شكرا': 'العفو! 🌟 دائماً سعيد بمساعدتك. هل لديك أي أسئلة أخرى؟',
            
            // العيادات
            'عيادات': `🏥 **عياداتنا المتخصصة:**
• 🦷 عيادة الأسنان - جميع علاجات الأسنان والتجميل
• 👶 عيادة الأطفال - رعاية كاملة من الولادة للمراهقة  
• 🩺 عيادة الجلدية - علاج البشرة والشعر والأظافر
• ❤️ عيادة الباطنة - أمراض القلب والداخلية
• 👁️ عيادة العيون - فحوصات وعلاجات متقدمة
• 🧠 عيادة الأعصاب - أمراض الجهاز العصبي

أختر عيادة لمعرفة المزيد عنها!`,

            // الخدمات
            'خدمات': `💊 **خدماتنا الشاملة:**
• 🔬 فحوصات طبية دورية شاملة
• 🩺 استشارات طبية متخصصة
• ✂️ إجراءات جراحية بسيطة
• 🧪 تحاليل مخبرية متكاملة
• 📷 أشعة تشخيصية متقدمة
• 💉 تطعيمات ووقاية
• 🏥 رعاية ما بعد العمليات

أي خدمة تريد الاستفسار عنها؟`,

            // الحجز
            'حجز': `📅 **لحجز موعد:**
1. 📞 **هاتفياً:** 966123456789
2. 🌐 **أونلاين:** املأ نموذج الحجز في الموقع
3. 🏥 **حضورياً:** تفضل بزيارتنا مباشرة
4. 📱 **واتساب:** 966123456789

أي عيادة تريد الحجز فيها؟`,

            // اتصال
            'رقم': `📞 **معلومات الاتصال:**
• الهاتف الرئيسي: 966123456789
• الواتساب: 966123456789  
• الطوارئ: 966123456789 (24/7)
• البريد: info@clinic.com

متاحون لخدمتك!`,

            // عنوان
            'عنوان': `📍 **عنوان المجمع:**
مجمع عيادات [اسم المجمع]
الرياض - حي العليا - شارع الملك فهد
(قرب مركز commercial)

🗺️ **الوصول:** مواقف مجانية - سهولة الوصول`,

            // أسعار
            'سعر': `💵 **بخصوص الأسعار:**
• الأسعار تختلف حسب الخدمة والعيادة
• لدينا باقات وعروض خاصة دورياً
• خصومات للكشف الدوري والعائلات
• تقسيط متاح لبعض الخدمات

📞 للاستفسار الدقيق: 966123456789`,

            // طوارئ
            'طوارئ': `🚨 **للحالات الطارئة:**
• هاتف الطوارئ: 966123456789 (24/7)
• داخل أوقات العمل: تفضل بالحضور فوراً
• للحالات الحرجة: نوصي بالتوجه لأقرب مستشفى طوارئ

👨‍⚕️ أطباء متاحون للطوارئ دائماً`,

            // نصائح طبية عامة
            'نصيحة': `💡 **نصائح طبية عامة:**
• 💧 اشرب 8 أكواب ماء يومياً
• 🏃‍♂️ مارس الرياضة 30 دقيقة يومياً
• 🥗 تناول غذاء متوازن
• 😴 احصل على 7-8 ساعات نوم
• 🚭 تجنب التدخين والمشروبات الغازية

هل تريد نصيحة محددة؟`,

            'صحة': `🌿 **للحفاظ على الصحة:**
• الفحوصات الدورية كل 6 أشهر
• التطعيمات حسب الجدول
• الرياضة المنتظمة
• الغذاء الصحي المتوازن
• النوم الكافي والراحة

العقل السليم في الجسم السليم!`,

            // رد افتراضي محسن
            'default': `🤔 **لم أفهم سؤالك تماماً، لكن يمكنني مساعدتك في:**

🏥 **معلومات العيادات** - اسأل عن عيادة محددة
📅 **حجز المواعيد** - كيفية الحجز والتواصل
💊 **الخدمات الطبية** - الخدمات المتوفرة
📞 **الاتصال بنا** - أرقام وعناوين
🌿 **نصائح طبية** - استفسارات صحية عامة

ما الذي تريد معرفته بالضبط؟`
        };

        // بحث أكثر ذكاءً
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }

        // إذا كان سؤال عن عيادة محددة
        if (lowerMessage.includes('اسنان') || lowerMessage.includes('سن') || lowerMessage.includes('ضرس')) {
            return responses['عيادات'] + '\n\n🦷 **تفاصيل عيادة الأسنان:** تنظيف، حشوات، تبييض، تقويم، علاج جذور، زراعة.';
        }
        
        if (lowerMessage.includes('اطفال') || lowerMessage.includes('طفل') || lowerMessage.includes('رضيع')) {
            return responses['عيادات'] + '\n\n👶 **تفاصيل عيادة الأطفال:** تطعيمات، فحوصات نمو، أمراض شائعة، استشارات رضاعة.';
        }
        
        if (lowerMessage.includes('جلد') || lowerMessage.includes('بشرة') || lowerMessage.includes('شعر')) {
            return responses['عيادات'] + '\n\n🩺 **تفاصيل عيادة الجلدية:** حب شباب، أمراض جلدية، عناية بالبشرة، إزالة شامات.';
        }

        if (lowerMessage.includes('عمل') || lowerMessage.includes('وقت') || lowerMessage.includes('ساعة')) {
            return '🕐 **مواعيد العمل:**\n• الأحد-الخميس: 8:00 صباحاً - 10:00 مساءً\n• الجمعة: 4:00 مساءً - 10:00 مساءً\n• السبت: 9:00 صباحاً - 6:00 مساءً';
        }

        return responses['default'];
    }

    // دالة إضافة الرسائل
    const appendMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const messageP = document.createElement('p');
        messageP.innerHTML = text;
        
        messageDiv.appendChild(messageP);
        chatBody.appendChild(messageDiv);

        // التمرير للأسفل
        chatBody.scrollTop = chatBody.scrollHeight;
        return messageDiv;
    };

    // دالة إرسال الرسالة
    const handleSendMessage = async () => {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;

        // إضافة رسالة المستخدم
        appendMessage(`<strong>أنت:</strong> ${userInput}`, 'user');
        chatInput.value = '';
        
        if (sendBtn) sendBtn.disabled = true;

        // مؤشر الكتابة
        const typingIndicator = appendMessage('<div class="typing-indicator">جاري الكتابة...</div>', 'bot');

        try {
            // الخطوة 3: تأكد من استدعاء الدالة الصحيحة:
            // الحصول على الرد من الـ API (أو الرد المحلي إذا فشل الـ API)
            const botResponse = await getAIResponse(userInput);
            
            // إزالة مؤشر الكتابة وإضافة الرد النهائي
            if (typingIndicator && typingIndicator.parentNode) typingIndicator.remove();
            appendMessage(`<strong>المساعد:</strong> ${botResponse}`, 'bot');
            
        } catch (error) {
            // هذا الجزء لن يتم الوصول إليه عادةً لأن getAIResponse تعالج الأخطاء داخلياً
            // ولكن كإجراء احترازي، يمكننا عرض رسالة خطأ عامة هنا
            if (typingIndicator && typingIndicator.parentNode) typingIndicator.remove();
            appendMessage(`<strong>المساعد:</strong> عذراً، حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.`, 'bot');
        } finally {
            if (sendBtn) sendBtn.disabled = false; // إعادة تفعيل الزر دائماً
        }
    };

    // إضافة event listeners
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleSendMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    // إظهار رسالة ترحيب عند فتح الشات بوت
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            // إضافة رسالة ترحيب فقط إذا كانت الشات فاضية
            if (chatBody.children.length <= 1) {
                setTimeout(() => {
                    appendMessage(`<strong>المساعد:</strong> أهلاً وسهلاً! 🌟 أنا المساعد الافتراضي للعيادة. كيف يمكنني مساعدتك اليوم؟`, 'bot');
                }, 500);
            }
        });
    }
});
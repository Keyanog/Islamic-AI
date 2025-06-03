import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import LanguageDetect from 'languagedetect';
import ErrorBoundary from './ErrorBoundary';

const lngDetector = new LanguageDetect();

interface Message {
  text: string;
  isUser: boolean;
  language?: string;
}

// Define types at the top of the file
type SupportedLanguage = 'arabic' | 'urdu' | 'bengali' | 'english';

interface LanguageConfig {
  direction: string;
  font: string;
  honorifics: {
    prophet: string;
    companion: string;
    scholar: string;
  };
  placeholder: string;
  thinking: string;
  send: string;
  welcome: string;
}

// Use Record instead of mapped type
// type LanguageConfigs = Record<SupportedLanguage, LanguageConfig>;

// Add Theme interface
interface Theme {
  primary: string;
  secondary: string;
  success: string;
  background: string;
  text: string;
  textLight: string;
  border: string;
  white: string;
  shadow: string;
  shadowLg: string;
}

// Update theme object with proper typing
const theme = {
  primary: '#10a37f',
  secondary: '#0e906f',
  success: '#22c55e',
  background: '#202123',
  text: '#ECECF1',
  textLight: '#9FA6B3',
  border: '#4E4F60',
  white: '#FFFFFF',
  shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  shadowLg: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
} as const;

// Update ThemeProvider with CSS variables
const ThemeProvider = styled.div`
  --primary: ${theme.primary};
  --primary-20: ${theme.primary}20;
  --secondary: ${theme.secondary};
  --success: ${theme.success};
  --background: ${theme.background};
  --background-light: rgba(255, 255, 255, 0.05);
  --text: ${theme.text};
  --text-light: ${theme.textLight};
  --border: ${theme.border};
  --white: ${theme.white};
  --shadow: ${theme.shadow};
  --shadow-lg: ${theme.shadowLg};
`;

// Add media breakpoints
const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px'
};

// Update Container to use ThemeProvider
const Container = styled(ThemeProvider)`
  width: 100%;
  min-height: 100vh;
  display: flex;
  background: linear-gradient(180deg, #1A1A1A 0%, #121212 100%);
  color: var(--text);
  position: relative;
  overflow-x: hidden;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
  }
`;

// Add smooth fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Header = styled.header`
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
`;

const MessageList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem 7rem 1rem;
  overflow-y: auto;
  scroll-behavior: smooth;
  max-width: 100%;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem 0.5rem 6rem 0.5rem;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

// Add types for styled components
interface MessageProps {
  isUser: boolean;
}

interface RTLProps {
  isRTL?: boolean;
}

// Message-related styled components
const StyledMessage = styled.div<MessageProps>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-start' : 'flex-end'};
  width: 100%;
  padding: 0.75rem 0;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.5rem 0;
  }
`;

const MessageWrapper = styled.div<MessageProps>`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-start' : 'flex-end'};

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 90%;
  }
`;

const MessageContent = styled.div<MessageProps>`
  max-width: 100%;
  padding: 1.25rem 1.5rem;
  background: ${props => props.isUser ? 'var(--background-light)' : 'var(--primary-20)'};
  border-radius: 16px;
  position: relative;
  box-shadow: var(--shadow);
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  ${props => props.isUser ? `
    border-top-left-radius: 4px;
    margin-left: 1rem;
  ` : `
    border-top-right-radius: 4px;
    margin-right: 1rem;
  `}

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .message-content {
    &.rtl {
      direction: rtl;
      text-align: right;
    }

    &.ltr {
      direction: ltr;
      text-align: left;
    }
  }
`;

const MessageTime = styled.div<MessageProps>`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: ${props => props.isUser ? '0.25rem 1rem 0' : '0.25rem 1rem 0'};
`;

// Content formatting components
const Paragraph = styled.p<RTLProps>`
  margin: 0.75rem 0;
  line-height: 1.8;
  color: var(--text);
  font-size: 1rem;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const QuoteBlock = styled.blockquote<RTLProps>`
  margin: 1rem 0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: var(--primary-20);
  border-${props => props.isRTL ? 'right' : 'left'}: 4px solid var(--primary);
  font-style: italic;
`;

const ContentBlock = styled.div`
  margin: 0.75rem 0;
`;

// Add VerseReference styled component
const VerseReference = styled.div<RTLProps>`
  font-size: 0.875rem;
  color: var(--text-light);
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: ${props => props.isRTL ? 'left' : 'right'};
  font-style: italic;
`;

// Avatar components
const Avatar = styled.div<MessageProps>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.1)' : 'rgba(16, 163, 127, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.isUser ? '0 0 0 1rem' : '0 1rem 0 0'};
  
  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.8)' : 'rgba(16, 163, 127, 0.8)'};
  }
`;

const QuranBlock = styled.div<RTLProps>`
  background: var(--primary-20);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  position: relative;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
  
  &::before {
    content: '۞';
    position: absolute;
    top: -0.75rem;
    ${props => props.isRTL ? 'right' : 'left'}: 50%;
    transform: ${props => props.isRTL ? 'translateX(50%)' : 'translateX(-50%)'};
    font-size: 1.5rem;
    color: var(--primary);
    background: var(--background);
    padding: 0 0.5rem;
  }
`;

// Add HadithReference styled component
const HadithReference = styled.div<RTLProps>`
  font-size: 0.875rem;
  color: var(--text-light);
  margin-top: 0.75rem;
  font-style: italic;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const ArabicTextBlock = styled.div<RTLProps>`
  font-family: 'Amiri', 'Traditional Arabic', serif;
  font-size: 1.35rem;
  line-height: 2;
  margin: 1rem 0;
  direction: rtl;
  text-align: right;
  color: var(--text);

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.2rem;
    line-height: 1.8;
  }
`;

const TranslationBlock = styled.div<RTLProps>`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
  font-size: 1rem;
  line-height: 1.8;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

// Update formatMessageContent function to handle more content types
const formatMessageContent = (text: string, language: string = 'english') => {
  const isRTL = ['arabic', 'urdu'].includes(language);
  const sections = text.split(/\n\s*\n/); // Split by double newlines

  return (
    <div className={`message-content ${isRTL ? 'rtl' : 'ltr'}`}>
      {sections.map((section, index) => {
        // Handle Arabic text sections
        if (section.includes('[arabic-text]')) {
          const arabicContent = section.replace(/\[arabic-text\]|\[\/arabic-text\]/g, '').trim();
          return (
            <ArabicTextBlock key={index} isRTL={true}>
              {arabicContent}
            </ArabicTextBlock>
          );
        }
        
        // Handle verse sections with references
        if (section.includes('[verse-section]')) {
          const content = section.replace(/\[verse-section\]|\[\/verse-section\]/g, '');
          const referenceMatch = content.match(/\(([\s\S]*?)\)$/);
          const verseText = referenceMatch ? content.replace(/\(([\s\S]*?)\)$/, '').trim() : content;
          const reference = referenceMatch ? referenceMatch[1] : '';
          
          return (
            <QuranBlock key={index} isRTL={isRTL}>
              <div>{verseText}</div>
              {reference && <VerseReference isRTL={isRTL}>{reference}</VerseReference>}
            </QuranBlock>
          );
        }

        // Handle Hadith sections
        if (section.includes('[hadith]')) {
          const content = section.replace(/\[hadith\]|\[\/hadith\]/g, '');
          const [hadithText, ...referenceLines] = content.split('\n');
          const reference = referenceLines.join('\n').trim();
          
          return (
            <div key={index}>
              <QuoteBlock isRTL={isRTL}>{hadithText}</QuoteBlock>
              {reference && <HadithReference isRTL={isRTL}>{reference}</HadithReference>}
            </div>
          );
        }

        // Handle translation sections
        if (section.includes('[translation]')) {
          const translationText = section.replace(/\[translation\]|\[\/translation\]/g, '').trim();
          return (
            <TranslationBlock key={index} isRTL={isRTL}>
              {translationText}
            </TranslationBlock>
          );
        }
        
        // Handle bullet points
        if (section.startsWith('•') || section.startsWith('-')) {
          const items = section.split(/\n/).filter(item => item.trim());
          return (
            <ContentBlock key={index}>
              {items.map((item, i) => (
                <Paragraph key={i} isRTL={isRTL}>• {item.replace(/^[•-]\s*/, '')}</Paragraph>
              ))}
            </ContentBlock>
          );
        }

        // Handle quotes
        if (section.startsWith('>')) {
          return (
            <QuoteBlock key={index} isRTL={isRTL}>
              {section.replace(/^>\s*/, '')}
            </QuoteBlock>
          );
        }

        // Regular paragraphs
        return <Paragraph key={index} isRTL={isRTL}>{section}</Paragraph>;
      })}
    </div>
  );
};

// Add CSS for verse blocks
// const GlobalStyle = styled.div`...`;

// Move MessageComponent after all its dependencies are defined
const MessageComponent = ({ message }: { message: Message }) => {
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
  };

  return (
    <StyledMessage isUser={message.isUser}>
      {message.isUser && <Avatar isUser={true}><UserIcon /></Avatar>}
      <MessageWrapper isUser={message.isUser}>
        <MessageContent isUser={message.isUser}>
          {formatMessageContent(message.text, message.language)}
        </MessageContent>
        <MessageTime isUser={message.isUser}>
          {formatTime()}
        </MessageTime>
      </MessageWrapper>
      {!message.isUser && <Avatar isUser={false}><AIIcon /></Avatar>}
    </StyledMessage>
  );
};

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AIIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

// Consolidate ArabicText styled component
// const ArabicText = styled.div`...`;

// const Translation = styled.div`...`;
// const Reference = styled.div`...`;
// const HadithBlock = styled.div`...`;
// const Narrator = styled.div`...`;
// const InputContainer = styled.div`...`;
// const InputWrapper = styled.div`...`;
// const Input = styled.textarea`...`;
// const SendButton = styled.button`...`;
// const LoadingSpinner = styled.div`...`;
// const SendIcon = () => (...);

// Update language config usage
const getSystemPromptForLanguage = (language: string) => {
  const prompts: Record<SupportedLanguage, string> = {
    english: `You are a highly precise and respectful Islamic knowledge assistant. Respond in English with beautifully formatted answers. Follow these guidelines:

1. Sources and Citations:
   - Qur'an: Always include complete reference (Surah name, number, and Ayah number)
   - Include Arabic text from authentic Qur'anic sources
   - Include accurate translation in English
   - Hadith: Only cite from authenticated collections
   - Include complete Hadith citations with narrator chain
   - Scholar opinions: Only cite from recognized scholars

2. Formatting:
   - Use [arabic-text] for Arabic text
   - Use [translation] for translations
   - Use [verse-section] for Quranic verses
   - Use [hadith] for Hadith texts
   - Use bullet points (•) for lists
   - Use > for quotes

3. Answer Structure:
   - Start with a clear introduction
   - Include relevant Arabic text with proper formatting
   - Provide accurate translation
   - Add detailed explanation
   - Include supporting evidence (Quran/Hadith)
   - End with complete references
   - Never leave answers incomplete

4. Language and Presentation:
   - Primary response language: English
   - Text direction: left-to-right
   - Use appropriate honorifics
   - Maintain respectful tone

5. Content:
   - Only provide verified information
   - If uncertain, recommend consulting a scholar
   - Focus on authentic sources
   - Avoid controversial topics
   - Ensure answers are complete and comprehensive`,
    arabic: `أنت مساعد ذكي متخصص في المعرفة الإسلامية. أجب باللغة العربية مع تنسيق جميل. اتبع هذه الإرشادات:

1. المصادر والمراجع:
   - القرآن: اذكر دائماً المرجع الكامل (اسم السورة، رقمها، رقم الآية)
   - أضف النص العربي من مصادر قرآنية موثوقة
   - أضف الترجمة العربية
   - الحديث: استشهد فقط من المجموعات الموثقة
   - اذكر دائماً مراجع الحديث كاملة
   - آراء العلماء: استشهد فقط من العلماء المعتمدين

2. التنسيق:
   [verse-section] للآيات القرآنية
   [arabic-text] للنص العربي
   [translation] للترجمات
   [reference] للمراجع

3. اللغة والعرض:
   - استخدم اللغة العربية الفصحى
   - اتجاه النص: من اليمين إلى اليسار
   - استخدم الألقاب المناسبة
   - حافظ على نبرة محترمة

4. المحتوى:
   - قدم فقط المعلومات الموثقة
   - إذا كنت غير متأكد، انصح باستشارة عالم
   - ركز على المصادر الموثوقة
   - تجنب المواضيع الخلافية`,
    urdu: `آپ ایک انتہائی درست اور محترم اسلامی علم کے اسسٹنٹ ہیں۔ اردو میں خوبصورتی سے فارمیٹ شدہ جوابات دیں۔ ان رہنما اصولوں پر عمل کریں:

1. ذرائع اور حوالہ جات:
   - قرآن: ہمیشہ مکمل حوالہ دیں (سورہ کا نام، نمبر، آیت نمبر)
   - معتبر قرآنی ذرائع سے عربی متن شامل کریں
   - اردو ترجمہ شامل کریں
   - حدیث: صرف مستند مجموعوں سے اقتباس کریں
   - حدیث کے مکمل حوالہ جات شامل کریں
   - علماء کی آراء: صرف تسلیم شدہ علماء سے اقتباس کریں

2. فارمیٹنگ:
   [verse-section] قرآنی آیات کے لیے
   [arabic-text] عربی متن کے لیے
   [translation] ترجمے کے لیے
   [reference] حوالہ جات کے لیے

3. زبان اور پیشکش:
   - بنیادی جواب کی زبان: اردو
   - متن کی سمت: دائیں سے بائیں
   - مناسب القابات کا استعمال کریں
   - محترمانہ لہجہ برقرار رکھیں

4. مواد:
   - صرف تصدیق شدہ معلومات فراہم کریں
   - اگر غیر یقینی ہو، تو عالم سے رجوع کرنے کا مشورہ دیں
   - معتبر ذرائع پر توجہ دیں
   - متنازعہ موضوعات سے گریز کریں`,
    bengali: `আপনি একজন অত্যন্ত সঠিক এবং সম্মানজনক ইসলামিক জ্ঞান সহকারী। বাংলায় সুন্দরভাবে ফরম্যাট করা উত্তর দিন। এই নির্দেশিকাগুলি অনুসরণ করুন:

1. উৎস এবং উদ্ধৃতি:
   - কুরআন: সর্বদা সম্পূর্ণ রেফারেন্স (সূরার নাম, নম্বর, আয়াত নম্বর)
   - প্রামাণিক কুরআনিক উৎস থেকে আরবি টেক্সট
   - বাংলা অনুবাদ অন্তর্ভুক্ত করুন
   - হাদীস: শুধুমাত্র প্রমাণিত সংকলন থেকে উদ্ধৃত করুন
   - সম্পূর্ণ হাদীস উদ্ধৃতি অন্তর্ভুক্ত করুন
   - আলেমদের মতামত: শুধুমাত্র স্বীকৃত আলেমদের উদ্ধৃত করুন

2. ফরম্যাটিং:
   [verse-section] কুরআনিক আয়াতের জন্য
   [arabic-text] عربی টেক্সটের জন্য
   [translation] অনুবাদের জন্য
   [reference] حوالہ جات کے لیے

3. ভাষা এবং উপস্থাপনা:
   - প্রাথমিক প্রতিক্রিয়া ভাষা: বাংলা
   - টেক্সট দিক: বাম থেকে ডান
   - উপযুক্ত সম্মানসূচক শব্দ ব্যবহার করুন
   - সম্মানজনক টোন বজায় রাখুন

4. বিষয়বস্তু:
   - শুধুমাত্র যাচাই করা তথ্য প্রদান করুন
   - অনিশ্চিত হলে, একজন আলেমের সাথে পরামর্শ করার পরামর্শ দিন
   - প্রামাণিক উৎসগুলিতে ফোকাস করুন
   - বিতর্কিত বিষয়গুলি এড়িয়ে চলুন`
  };

  return prompts[language as SupportedLanguage] || prompts.english;
};

const getWelcomeMessage = (language: string) => {
  const messages: Record<SupportedLanguage, string> = {
    arabic: 'السلام عليكم! أنا مساعدك الإسلامي الذكي. أقدم معلومات من مصادر إسلامية موثوقة فقط. كيف يمكنني مساعدتك اليوم؟',
    urdu: 'السلام علیکم! میں آپ کا اسلامی اے آئی اسسٹنٹ ہوں۔ میں صرف مستند اسلامی ذرائع سے معلومات فراہم کرتا ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟',
    bengali: 'আসসালামু আলাইকুম! আমি আপনার ইসলামিক এআই সহকারী। আমি কেবল প্রামাণিক ইসলামিক সূত্র থেকে তথ্য প্রদান করি। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
    english: "As-salaam-alaikum! I am your Islamic AI assistant. I provide information only from authentic Islamic sources. How may I assist you today?"
  };

  return messages[language as SupportedLanguage] || messages.english;
};

// Add new styled components for better message formatting
// const MessageBlock = styled.div`...`;

// Add content components
const ContentSection = styled.div`
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin: 1rem;
`;

const ContentTitle = styled.h2`
  font-size: 1.5rem;
  color: #FFFFFF;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 24px;
    height: 24px;
    color: rgba(16, 163, 127, 0.9);
  }
`;

const ContentText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ContentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const ContentListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: rgba(16, 163, 127, 0.9);
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
`;

// Content components for each section
const OverviewContent = () => (
  <ContentSection>
    <ContentTitle>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      Overview
    </ContentTitle>
    <ContentText>
      Islamic AI is an advanced artificial intelligence assistant designed to provide accurate and authentic Islamic information.
    </ContentText>
    <ContentList>
      <ContentListItem>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <div>
          <strong>Authentic Sources</strong>
          <p>All information is derived from the Quran, authentic Hadith, and recognized scholarly works.</p>
        </div>
      </ContentListItem>
    </ContentList>
  </ContentSection>
);

const GettingStartedContent = () => (
  <ContentSection>
    <ContentTitle>Getting Started</ContentTitle>
    <ContentText>Welcome to Islamic AI!</ContentText>
  </ContentSection>
);

const LanguageSupportContent = () => (
  <ContentSection>
    <ContentTitle>Language Support</ContentTitle>
    <ContentText>Islamic AI supports multiple languages.</ContentText>
  </ContentSection>
);

const SourcesContent = () => (
  <ContentSection>
    <ContentTitle>Sources & Citations</ContentTitle>
    <ContentText>All information comes from authentic sources.</ContentText>
  </ContentSection>
);

const GuidelinesContent = () => (
  <ContentSection>
    <ContentTitle>Guidelines</ContentTitle>
    <ContentText>Islamic AI follows strict guidelines.</ContentText>
  </ContentSection>
);

// Add interface for active section
interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const StyledSidebar = styled.nav<{ isOpen: boolean }>`
  width: 280px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  transition: transform 0.3s ease;
  backdrop-filter: blur(10px);

  @media (max-width: ${breakpoints.tablet}) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    width: 100%;
    max-width: 320px;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 24px;
    height: 24px;
    color: rgba(16, 163, 127, 0.9);
  }
`;

const NavContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  
  /* Customize scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const NavSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    padding-bottom: 1rem; /* Add some padding at the bottom for better scrolling */
  }
`;

const NavTitle = styled.h3`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled.a<{ active: boolean }>`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9375rem;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${props => props.active ? 'rgba(16, 163, 127, 0.1)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MainContent = styled.main<{ hasSidebar: boolean }>`
  margin-left: ${props => props.hasSidebar ? '280px' : '0'};
  width: ${props => props.hasSidebar ? 'calc(100% - 280px)' : '100%'};
  height: 100vh;
  transition: margin-left 0.3s ease, width 0.3s ease;

  @media (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
    width: 100%;
  }
`;

const MenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 20;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #FFFFFF;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  backdrop-filter: blur(5px);

  @media (max-width: ${breakpoints.tablet}) {
    display: block;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const Overlay = styled.div<{ isVisible: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  backdrop-filter: blur(3px);

  @media (max-width: ${breakpoints.tablet}) {
    display: ${props => props.isVisible ? 'block' : 'none'};
  }
`;

// Add Footer styled components
const SidebarFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const AuthorLink = styled.a`
  color: var(--text-light);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--white);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// Update the Sidebar component to use the new structure
const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeSection, onSectionChange }) => (
  <StyledSidebar isOpen={isOpen}>
    <SidebarHeader>
      <Logo>
        <AIIcon />
        Islamic AI
      </Logo>
    </SidebarHeader>

    <NavContainer>
      <NavSection>
        <NavTitle>About</NavTitle>
        <NavList>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeSection === 'overview'}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('overview');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeSection === 'getting-started'}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('getting-started');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17L21 12L16 7" />
                <path d="M21 12H9" />
              </svg>
              Getting Started
            </NavLink>
          </NavItem>
        </NavList>
      </NavSection>

      <NavSection>
        <NavTitle>Features</NavTitle>
        <NavList>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeSection === 'language-support'}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('language-support');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
              Language Support
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeSection === 'sources'}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('sources');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
              </svg>
              Sources & Citations
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeSection === 'guidelines'}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('guidelines');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Guidelines
            </NavLink>
          </NavItem>
        </NavList>
      </NavSection>

      <NavSection>
        <NavTitle>Resources</NavTitle>
        <NavList>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeSection === 'documentation'}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('documentation');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              Documentation
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#" 
              active={activeSection === 'updates'}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('updates');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Updates
            </NavLink>
          </NavItem>
        </NavList>
      </NavSection>
    </NavContainer>

    <SidebarFooter>
      <AuthorLink 
        href="https://github.com/Keyanog" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <GitHubIcon />
        Created by Nazif Keyan
      </AuthorLink>
    </SidebarFooter>
  </StyledSidebar>
);

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

// Add loading animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: transparent;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 100;
  pointer-events: none;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.75rem;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  max-width: 768px;
  position: relative;
  padding: 0 1rem;
  pointer-events: auto;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0 0.5rem;
  }
`;

const Input = styled.textarea`
  width: 100%;
  padding: 1rem 3.5rem 1rem 1.25rem;
  background: rgba(32, 33, 35, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: #ECECF1;
  font-size: 0.975rem;
  resize: none;
  min-height: 60px;
  max-height: 150px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: none;
    border-color: rgba(16, 163, 127, 0.5);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2),
                0 0 0 2px rgba(16, 163, 127, 0.2);
    background: rgba(32, 33, 35, 0.7);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.875rem 3rem 0.875rem 1rem;
    font-size: 0.9rem;
    min-height: 50px;
  }
`;

const SendButton = styled.button<{ isLoading?: boolean }>`
  position: absolute;
  right: 1.5rem;
  bottom: 50%;
  transform: translateY(50%);
  background-color: ${props => props.isLoading ? 'transparent' : 'var(--primary)'};
  border: none;
  color: var(--white);
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  padding: 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  
  &:hover:not(:disabled) {
    background-color: var(--secondary);
    transform: translateY(50%) scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (max-width: ${breakpoints.mobile}) {
    right: 1.25rem;
    padding: 0.625rem;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #FFFFFF;
  animation: ${spin} 0.8s linear infinite;
`;

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IslamicAI = () => {
  const [messages, setMessages] = useState<Message[]>([{
    text: getWelcomeMessage('english'),
    isUser: false,
    language: 'english'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle textarea auto-resize
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const detectLanguage = (text: string): string => {
    if (!text) return 'english';
    
    // Remove unused indonesian regex
    const detected = lngDetector.detect(text);
    if (!detected || detected.length === 0) return 'english';
    
    const [lang] = detected[0]; // Remove unused confidence
    return lang.toLowerCase();
  };

  const getLanguageConfig = (lang: string) => {
    const configs: Record<SupportedLanguage, LanguageConfig> = {
      arabic: {
        direction: 'rtl',
        font: "'Amiri', 'Traditional Arabic', serif",
        honorifics: {
          prophet: 'ﷺ',
          companion: 'رضي الله عنه',
          scholar: 'رحمه الله'
        },
        placeholder: 'اكتب رسالتك هنا...',
        thinking: 'جاري التفكير...',
        send: 'إرسال',
        welcome: 'السلام عليكم'
      },
      urdu: {
        direction: 'rtl',
        font: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
        honorifics: {
          prophet: 'صلی اللہ علیہ وسلم',
          companion: 'رضی اللہ عنہ',
          scholar: 'رحمۃ اللہ علیہ'
        },
        placeholder: 'اپنا پیغام یہاں لکھیں...',
        thinking: 'سوچ رہا ہے...',
        send: 'بھیجیں',
        welcome: 'السلام علیکم'
      },
      bengali: {
        direction: 'ltr',
        font: "'Noto Sans Bengali', sans-serif",
        honorifics: {
          prophet: 'সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম',
          companion: 'রাদিয়াল্লাহু আনহু',
          scholar: 'রহমাতুল্লাহি আলাইহি'
        },
        placeholder: 'আপনার বার্তা এখানে লিখুন...',
        thinking: 'ভাবছি...',
        send: 'পাঠান',
        welcome: 'আসসালামু আলাইকুম'
      },
      english: {
        direction: 'ltr',
        font: "'Arial', sans-serif",
        honorifics: {
          prophet: '(peace be upon him)',
          companion: '(may Allah be pleased with them)',
          scholar: '(may Allah have mercy on him)'
        },
        placeholder: 'Type your message here...',
        thinking: 'Thinking...',
        send: 'Send',
        welcome: 'As-salaam-alaikum'
      }
    };

    return configs[lang as SupportedLanguage] || configs.english;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userLanguage = detectLanguage(input) as SupportedLanguage;
    // Remove unused config variable
    // const config = getLanguageConfig(userLanguage);

    const userMessage = {
      text: input,
      isUser: true,
      language: userLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Islamic AI Assistant'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-preview-05-20',
          messages: [
            {
              role: 'system',
              content: getSystemPromptForLanguage(userLanguage)
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.1,
          max_tokens: 4000,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error?.message || 
          `API Error (${response.status}): ${response.statusText || 'Failed to get response from AI'}`
        );
      }

      const data = await response.json();
      
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      setMessages(prev => [...prev, {
        text: data.choices[0].message.content,
        isUser: false,
        language: userLanguage
      }]);
    } catch (error) {
      console.error('API Error:', error);
      // Remove unused errorMessage variable
      const defaultErrorMessage = 'I apologize, but I encountered an error. Please check your API key configuration or try again later.';
      setMessages(prev => [...prev, {
        text: defaultErrorMessage,
        isUser: false,
        language: userLanguage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewContent />;
      case 'getting-started':
        return <GettingStartedContent />;
      case 'language-support':
        return <LanguageSupportContent />;
      case 'sources':
        return <SourcesContent />;
      case 'guidelines':
        return <GuidelinesContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <Container>
      <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <MenuIcon />
      </MenuButton>
      
      <Overlay 
        isVisible={isSidebarOpen} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <MainContent hasSidebar={isSidebarOpen}>
        <Header>
          <HeaderTitle>Islamic AI Assistant</HeaderTitle>
        </Header>
        
        <ContentContainer>
          {renderContent()}
        </ContentContainer>

        <MessageList>
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </MessageList>
        <InputContainer>
          <InputWrapper>
            <Input
              value={input}
              onChange={handleInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={getLanguageConfig(detectLanguage(input))?.placeholder || getLanguageConfig('english').placeholder}
              disabled={isLoading}
            />
            <SendButton 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()} 
              isLoading={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : <SendIcon />}
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </MainContent>
    </Container>
  );
};

const WrappedIslamicAI = () => (
  <ErrorBoundary>
    <IslamicAI />
  </ErrorBoundary>
);

export default WrappedIslamicAI; 
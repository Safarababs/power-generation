import "arabic-fonts/src/css/arabic-fonts.css";
import { CTable } from "@coreui/react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { useRef } from "react";

const FirstMoharran = () => {
  const tableRef = useRef();
  const handleDownload = () => {
    const element = tableRef.current;
    html2pdf()
      .set({
        margin: 0,
        filename: "FirstMoharran.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, dpi: 300 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all"] },
      })
      .from(element)
      .save();
  };

  const columns = [
    {
      key: "class",
      label: "النص العربي",
      _props: { scope: "col", style: { textAlign: "right" } },
    },
    {
      key: "heading_1",
      label: "ترجمہ (اردو)",
      _props: { scope: "col", style: { textAlign: "right" } },
    },
  ];

  const items = [
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اللہ کے نام سے، جو بے حد مہربان، نہایت رحم والا ہے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ٱلْـحَمْدُ لِلّٰهِ رَبِّ ٱلْعَٰلَمِينَ۔
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ٱلْـحَمْدُ لِلّٰهِ ٱلَّذِي نَوَّرَ قُلُوبَنَا بِوِلَايَةِ آلِ
          مُحَمَّدٍ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سب تعریفیں اس اللہ کے لیے ہیں جس نے ہمارے دلوں کو آلِ محمد کی ولایت سے
          منور کیا۔۔۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَٱلصَّلَاةُ وَٱلسَّلَامُ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَآلِهِ
          ٱلطَّاهِرِينَ۔
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          درود و سلام ہو ہمارے سردار محمد ﷺ اور ان کے پاکیزہ اہلِ بیت پر۔
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَٱللَّعْنَةُ ٱلدَّائِمَةُ عَلَىٰ أَعْدَائِهِمْ أَجْمَعِينَ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اور ان کے سب دشمنوں پر ہمیشہ کی لعنت ہو۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مِنَ ٱلْآنِ إِلَىٰ قِيَامِ يَوْمِ ٱلدِّينِ۔
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اب سے لے کر روزِ قیامت تک۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صَلَّى ٱللّٰهُ عَلَىٰ سَيِّدِنَا وَنَبِيِّنَا أَبِي ٱلْقَاسِمِ
          مُحَمَّدٍ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اللہ کی رحمت ہو ہمارے آقا و نبی، ابو القاسم محمد ﷺ پر۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صَلَّى ٱللّٰهُ عَلَيْكَ يَا مَوْلَانَا يَا رَسُولَ ٱللّٰهِ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر، اے ہمارے سردار، اے اللہ کے رسول!
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صَلَّى ٱللّٰهُ عَلَيْكَ يَا مَوْلَانَا يَا ٱبْنَ مَوْلَانَا يَا أَبَا
          عَبْدِ ٱللّٰهِ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر، اے ہمارے آقا، اے ہمارے آقا کے بیٹے، اے ابا عبد اللہؑ!
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صَلَّى ٱللّٰهُ عَلَيْكَ يَا أَبَا ٱلرَّضِيعِ ٱلْمَذْبُوحِ عَلَىٰ
          صَدْرِكَ يَا حُسَيْنُ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر، اے شیرخوار جسے سینے پر ذبح کیا گیا، اے حسینؑ!
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَيَا لَيْتَنَا كُنَّا مَعَكُمْ فَنَفُوزَ فَوْزًا عَظِيمًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کاش ہم آپ کے ساتھ ہوتے اور عظیم کامیابی حاصل کرتے۔
        </span>
      ),
    },

    {
      id: 13,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          كَمْ يَا هِلَالَ مُحَرَّمٍ تُشْجِينَا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اے ہلالِ محرم! تو ہمیں کتنی بار غمگین کرتا ہے
        </span>
      ),
    },
    {
      id: 14,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مَا زَالَ قَوْسُكَ نَبْلُهُ يَرْمِينَا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تیرا کمان بدستور ہمیں تیر برساتا رہا
        </span>
      ),
    },
    {
      id: 33,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          قَالَ ٱلْإِمَامُ ٱلصَّادِقُ (عَلَيْهِ ٱلسَّلَامُ): إِنَّ ٱلْـحُسَيْنَ
          بْنَ عَلِيٍّ (ع) لَمَّا مَضَى، بَكَتْ عَلَيْهِ ٱلسَّمَاوَاتُ
          ٱلسَّبْعُ، وَٱلْأَرَضُونَ ٱلسَّبْعُ، وَمَا فِيهِنَّ وَمَا بَيْنَهُنَّ،
          وَمَنْ يَنْقَلِبُ عَلَيْهِنَّ، وَٱلْجَنَّةُ وَٱلنَّارُ، وَكُلُّ مَا
          خَلَقَ ٱللَّهُ مِمَّا يُرَى وَمَا لَا يُرَى.
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          امام صادقؑ نے فرمایا: جب حسین بن علیؑ شہید ہوئے تو ساتوں آسمان، ساتوں
          زمینیں، ان میں جو کچھ تھا اور جو ان کے درمیان تھا، جنت، جہنم، اور وہ
          تمام مخلوقات جنہیں اللہ نے پیدا کیا۔چاہے وہ دیکھی جا سکیں یا نہ دیکھی
          جا سکیں۔سب نے ان پر گریہ کیا۔
        </span>
      ),
    },
    {
      id: 15,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          كُلُّ الْمَصَائِبِ قَدْ تَهُونُ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تمام مصیبتیں ہلکی لگتی ہیں
        </span>
      ),
    },
    {
      id: 16,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سِوَى الَّتِي تَرَكَتْ فُؤَادَ مُحَمَّدٍ مَحْزُونًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سوائے اس کے جس نے محمدؐ کے دل کو غمگین چھوڑ دیا
        </span>
      ),
    },
    {
      id: 17,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          يَوْمٌ بِهِ ازْدَلَفَتْ طُغَاةُ أُمَيَّةٍ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وہ دن جب بنی امیہ کے ظالم آگے بڑھے
        </span>
      ),
    },
    {
      id: 18,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          كَيْ تَشْفِيَنَّ مِنَ الْحُسَيْنِ ضَغُونَا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تاکہ اپنے دل کی جلن حسینؑ سے بدلہ لے کر بجھائیں
        </span>
      ),
    },
    {
      id: 19,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نَادَى أَلَا هَلْ مِنْ مُعِينٍ لَمْ يَجِدْ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          پکارا: کیا کوئی مددگار ہے؟ مگر کوئی نہ آیا
        </span>
      ),
    },
    {
      id: 20,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          إِلَّا الْمُحَدَّدَةَ الرِّقَاقَ مُعِينًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سوائے ان خیموں میں قیدی عورتوں اور بچوں کے
        </span>
      ),
    },
    {
      id: 21,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَهَوَى عَلَى وَجْهِ الصَّعِيدِ مُبَضَّعًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          پھر وہ زخمی ہو کر زمین پر گر پڑے
        </span>
      ),
    },
    {
      id: 22,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مَا نَالَ تَغْسِيلًا وَلَا تَكْفِينًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نہ غسل ملا، نہ کفن دیا گیا
        </span>
      ),
    },
    {
      id: 23,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَسَرَوْا بِنِسْوَتِهِ عَلَى عُجُفِ الْمَطَا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اور اہلِ حرم کو دُبلے اُونٹوں پر سوار کر کے لے جایا گیا
        </span>
      ),
    },
    {
      id: 24,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تَطْوِي سُهُولًا بِالْفَلَا وَحُزُونَا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وہ صحرا کی ہموار وادیوں اور پہاڑیوں سے گزر رہی تھیں
        </span>
      ),
    },
    {
      id: 25,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          أَوْ مِثْلُ زَيْنَبَ وَهْيَ بِنْتُ مُحَمَّدٍ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کیا زینبؑ جیسی، جو محمدؐ کی نواسی تھیں
        </span>
      ),
    },
    {
      id: 26,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          بَرَزَتْ تُخَاطِبُ شَامِتًا مَلْعُونًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نکلیں اور ملعون شمر سے خطاب کیا
        </span>
      ),
    },
    {
      id: 27,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَغَدَا بِمَحْضَرِهَا يُقَلِّبُ مَبْسَمًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وہ یزیدؔ کے دربار میں موجود تھیں اور وہ لبوں کو پلٹ رہا تھا
        </span>
      ),
    },
    {
      id: 28,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          كَانَ النَّبِيُّ بِرَشْفِهِ مَفْتُونًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          جس کا بوسہ رسولؐ لیتے تھے، اسے وہ چھیڑ رہا تھا
        </span>
      ),
    },
    {
      id: 29,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نَثَرَتْ عَقِيقَ دُمُوعِهَا لَمَّا غَدَا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس نے اپنے یاقوت جیسے آنسو بہا دیے جب وہ منظر دیکھا
        </span>
      ),
    },
    {
      id: 30,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          بِعَصَاهُ يَنْكُتُ لُؤْلُؤًا مَكْنُونًا
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وہ چھڑی سے اس چہرۂ حسینؑ کو چھیڑ رہا تھا جو چھپے موتی جیسا تھا
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          غَرِيبٌ يَا مَظْلُومَ كَرْبَلَاءَ كَرْبَلَاءَ كَرْبَلَاءَ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اے مظلومِ کربلا! اے غریبِ کربلا! کربلا... کربلا...
        </span>
      ),
    },
    {
      id: 31,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          قال امام الرضا ع كَانَ أَبِي عَلَيْهِ ٱلسَّلَامُ إِذَا دَخَلَ شَهْرُ
          ٱلْمُحَرَّمِ، لَا يُرَى ضَاحِكًا، وَكَانَتِ ٱلْكَآبَةُ تَغْلِبُ
          عَلَيْهِ حَتَّى تَمْضِيَ عَشَرَةُ أَيَّامٍ، فَإِذَا كَانَ يَوْمُ
          ٱلْعَاشِرِ، كَانَ ذَٰلِكَ ٱلْيَوْمُ يَوْمَ مُصِيبَتِهِ وَحُزْنِهِ
          وَبُكَائِهِ
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          📃 جب محرم کا مہینہ آتا تو میرے والد کو کوئی ہنستے نہیں دیکھتا بلکہ غم
          کی حالت میں رہتے اور جب دسویں محرم کا دن آتا تو سارا دن آہ و بکا اور
          گریہ میں گذرتا تھا۔
        </span>
      ),
    },
    {
      id: 31,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          رُوِيَ أَنَّهُ قِيلَ لِلْإِمَامِ ٱلصَّادِقِ (عَلَيْهِ ٱلسَّلَامُ):
          سَيِّدِي، جُعِلْتُ فِدَاكَ، إِنَّ ٱلْمَيِّتَ يُجْلَسُونَ لَهُ
          بِٱلنِّيَاحَةِ بَعْدَ مَوْتِهِ أَوْ قَتْلِهِ، وَأَرَاكُمْ تَجْلِسُونَ
          أَنْتُمْ وَشِيعَتُكُمْ مِنْ أَوَّلِ ٱلشَّهْرِ بِٱلْمَأْتَمِ
          وَٱلْعَزَاءِ عَلَى ٱلْحُسَيْنِ (ع)!
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          روایت ہے کہ امام صادقؑ سے پوچھا گیا: ’’میرے آقا! میں آپ پر قربان جاؤں،
          کسی میت کے مرنے یا قتل کے بعد اس کے لیے نوحہ ہوتا ہے، لیکن میں دیکھتا
          ہوں کہ آپ اور آپ کے شیعہ یکم محرم سے ہی امام حسینؑ کے لیے ماتم شروع کر
          دیتے ہیں!‘‘
        </span>
      ),
    },
    {
      id: 32,
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَقَالَ (عَلَيْهِ ٱلسَّلَامُ): «يَا هَذَا، إِذَا هَلَّ هِلَالُ
          مُحَرَّمٍ نَشَرَتِ ٱلْمَلَائِكَةُ ثَوْبَ ٱلْحُسَيْنِ (ع) وَهُوَ
          مُخَرَّقٌ مِنْ ضَرْبِ ٱلسُّيُوفِ وَمُلَطَّخٌ بِٱلدِّمَاءِ، فَنَرَاهُ
          نَحْنُ، وَشِيعَتُنَا بِٱلْبَصِيرَةِ لَا بِٱلْبَصَرِ، فَتَنْفَجِرُ
          دُمُوعُنَا».
        </span>
      ),
      heading_1: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تو آپؑ نے فرمایا: ’’اے شخص! جب محرم کا چاند طلوع ہوتا ہے تو فرشتے امام
          حسینؑ کا وہ لباس پھیلا دیتے ہیں جو تلواروں کی ضربوں سے چھلنی اور خون
          میں لت پت ہوتا ہے۔ ہم اور ہمارے شیعہ اسے بصیرت کی نگاہ سے دیکھتے ہیں،
          نہ کہ ظاہری آنکھ سے، اور اسی وقت ہمارے آنسو جاری ہو جاتے ہیں۔‘‘
        </span>
      ),
    },
  ];

  return (
    <div>
      <button onClick={handleDownload}>Download PDF</button>
      <div dir="rtl" ref={tableRef} style={{ pageBreakInside: "avoid" }}>
        <CTable columns={columns} items={items} />
      </div>
    </div>
  );
};

export default FirstMoharran;

import "arabic-fonts/src/css/arabic-fonts.css";
import { CTable } from "@coreui/react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { useRef } from "react";

const ThirdMoharram = () => {
  const tableRef = useRef();
  const handleDownload = () => {
    const element = tableRef.current;
    html2pdf()
      .set({
        margin: 0,
        filename: "FirstMoharran.pdf",
        image: { type: "jpeg", quality: 1 },
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
  ];

  const items = [
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          جَدَّتِي جِئْتُ مِنَ ٱلْهَمِّ عَلِيلَةً
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی بیمار دھی ملن آئ ای
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَبِقَلْبِي أَشْعَلَ ٱلْحُزْنُ فَتِيلَهُ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی میرا دل ڈاڈھا پریشان اے
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          لَا أَرَى لِلْفَرَجِ ٱلدَّانِي سَبِيلَةً
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی میرا کوئ رشتہ باقی نہیں٘ رہ گیا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَٱرْحَمِي يَا بَضْعَةَ ٱلْهَادِي شُجُونِي
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی بھرے مدینے میرے تیرے سوا کوئ نہیں رہ گیا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          بَيْنَ بَابٍ وَجِدَارٍ مَا عُصِرْتُ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی میرے 40 گھر دیے دروازے بند ہو گئے{" "}
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          آهِ لَكِنِّي بِأَرْزَائِي كُسِرْتُ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی اکبر دے ٹر ونجن دے بعد میں تنہا رہ گئی
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          كَمْ عَلَى الْأَعْتَابِ بِالْوَجْدِ احْتَضَرْتُ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی میرا ثیال رکھیں میرے ساہ بند پئے تھیندن{" "}
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَبِلَيْلِي قَرَّحَ الدَّمْعُ جُفُونِي
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی اج پہلی رات اے لگڑییاں حویلیاں ہن
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          جَدَّتِي أَيْنَ أَبِي؟ أَيْنَ الْأَحِبَّهْ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          نانی جان! میرے بابا کہاں ہیں؟ میرے پیارے کہاں ہیں؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          إِنَّمَا الْعَيْشُ بِدُونِ الْأَهْلِ غُرْبَهْ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          حقیقت میں اہلِ خاندان کے بغیر زندگی اجنبی ہے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          بَلْ حَيَاتِي أَنْ يَكُونَ الْمَوْتُ قُرْبَهْ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          بلکہ میری زندگی یہی ہے کہ موت میرے قریب ہو۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          لَيْتَهُمْ فِي رَكْبِهِمْ قَدْ أَخَذُونِي
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کاش! وہ قافلے میں مجھے بھی اپنے ساتھ لے گئے ہوتے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَأَجَابَتْ زَهْرَةُ الْقَبْرِ الْمُعَفَّى
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تو قبروں میں آرام کرتی زہراؑ نے جواب دیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          كَرْبَلَاءُ لَمْ تَدَعْ خِلًّا وَإِلْفَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کربلا نے نہ کوئی دوست چھوڑا، نہ کوئی محبوب باقی رکھا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          خَطَفَتْ أَهْلِيكِ حَتَّى الطِّفْلَ خَطْفَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اُس نے تمہارے اہلِ بیت کو چھین لیا، یہاں تک کہ شیرخوار کو بھی چھین
          لیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَحُسَيْنٌ ذَاقَ كَاسَاتِ الْمَنُونِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اور حسینؑ نے موت کے جام چکھے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          إِنَّ صَدْرًا كَانَ لِلرَّحْمَةِ مَنْبَعْ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          یہ وہ سینہ ہے جو رحمت کا سرچشمہ تھا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          يَا بْنَتِي شِمْرٌ عَلَيْهِ قَدْ تَرَبَّعْ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اے بیٹی! اسی سینے پر شمر بیٹھا تھا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَبِجُرْدِ الْخَيْلِ فِي الرَّمْلِ تُوَزَّعْ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ننگی تلواروں والے گھوڑوں نے ریت پر اسے پامال کیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَغَدَتْ زَيْنَبُ تُسْبَى لِلْخَؤُونِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اور زینبؑ کو بے وفا لوگوں کے لیے قید کر کے لے جایا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          أَوْثَقُوهَا كَعَلِيٍّ بِٱلْحِبَالِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اُسے بھی علیؑ کی طرح رسّیوں سے باندھا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مِثْلَ ضَرْبِي ضُرِبَتْ بِنْتُ ٱلدَّلَالِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          میری مار کی طرح دخترِ رسالتؐ کو بھی مارا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          خَدُّهَا ٱلْمَلْطُومُ يَشْكُو أَيَّ حَالِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس کا تھپڑ کھایا ہوا رخسار کس حال کی شکایت کر رہا ہے!
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مَتْنُهَا شَابَهَ بِٱلْجُرْحِ مُتُونِي
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اُس کی پیٹھ بھی زخموں میں میری پیٹھ جیسی ہو گئی۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          أَجْهَشَتْ بِنْتُ حُسَيْنٍ لِلرَّزِيَّهْ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          حسینؑ کی بیٹی مصیبت پر زاروقطار رو پڑی۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ثُمَّ قَالَتْ: جَدَّتِي أَيْنَ رُقَيَّهْ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          پھر کہا: نانی جان! رقیہؑ کہاں ہے؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَأَجَابَتْ فَاطِمٌ: مَاتَتْ سَبِيَّهْ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فاطمہؑ نے جواب دیا: وہ بچی وفات پا چکی ہے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          عَيْنُهَا الْحَمْرَاءُ قَدْ حَاكَتْ عُيُونِي
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اُس کی سُرخ آنکھیں میری آنکھوں کی مانند ہو گئی تھیں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کونین دیاں شہزادیاں دے اٹھ آن کھلوتے در تےِ<br></br>اجاں نہن حیواناں
          ہوئے وہ گوڈیاں لائیاں لگ جندرے گئے ہر گھر دے <br></br>پھٹ جگر گیا جداں
          عون دی امڑی تے چا برقعی پایا سر تے <br></br>ودا نال دیواراں روندا اے
          رکھ ہتھ عباس جگر تے
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          كَانَ ٱلْحُسَيْنُ يُوَدِّعُ ٱلْمَدِينَةَ، وَقَدْ ضَمَّ ٱبْنَتَهُ
          ٱلرَّبَاعِيَّةَ إِلَىٰ صَدْرِهِ، يَطُوفُ بِهَا أَزِقَّةَ ٱلْمَدِينَةِ
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وسدا مدینہ، حسینؑ چار سال دی دھی نوں سینے نال لا کے مدینے دیاں گلیاں
          وچ روندا ودا اے
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَقَفْتُ عَلَىٰ قَبْرِ ٱلزَّهْرَاءِ وَقُلْتُ: يَا أُمِّي، هَذَا
          سَلَامِي ٱلْأَخِيرُ
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اماں حسین دا آخری سلام ہووی{" "}
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صَحَابِيٌّ يَسْكُنُ ٱلْمَدِينَةَ، قَدْ فَقَدَ ٱلْبَصَرَ وَٱلسَّمْعَ،
          وَلٰكِنَّ قَلْبَهُ لَا يَزَالُ نَابِضًا بِٱلْوَفَاءِ
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مدینے وچ وسن والا اک صحابی اے، جیہڑا نہ ویکھ سکدا اے تے نہ سن سکدا، پر
          دل وج محمدؐ دے نال پیار اج وی زندہ اے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          عِنْدَ مُنْتَصَفِ ٱللَّيْلِ، ٱنْتَبَهَ رَجُلٌ بِصَرْخَةٍ، فَنَادَىٰ
          زَوْجَتَهُ: أَأَنَا أَحْلَمُ، أَمْ أَنَّ بَنَاتِ عَلِيٍّ يَبْكِينَ؟
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          آدھی رات دا ویلا سی، اوہ بندہ چیخ مار کے اٹھیا تے بیوی نوں آکھیا: میں
          خواب وچ آں یا علیؑ دیاں دھیواں روندیاں نیں؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَقَالَتْ زَوْجَتُهُ: ٱحْمَدِ ٱللّٰهَ أَنَّكَ لَا تُبْصِرُ وَلَا
          تَسْمَعُ، فَأَنْتَ سَمِعْتَ بُكَاءَهُنَّ ٱلْيَوْمَ، أَمَّا أَنَا
          فَأَسْمَعُهُنَّ مُنْذُ ثَلَاثِ لَيَالٍ
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اوہدی زوجہ آکھی: شکر کرو تہاڈیاں اکھاں نیں تے نہ تہاڈی سُنبھائی اے۔
          تُسیں آج سُنیا اوہ روندیاں نیں، میں تین راتاں توں روندیاں سُن رہی آں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ٱلْيَوْمَ ٱللَّيْلَةُ ٱلثَّالِثَةُ، وَأَصْوَاتُ بُكَاءِ بَنَاتِ
          عَلِيٍّ تَرْتَفِعُ، يُنَادِينَ: يَا جَدُّنَا، كَأَنَّ وَقْتَ
          ٱلْوَفَاءِ بِٱلْوُعُودِ قَدْ أَزِفَ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          آج تیسری رات ہے، علیؑ کی بیٹیوں کی رونے کی آوازیں بلند ہیں، رو رو کر
          کہہ رہی ہیں: نانا! یوں محسوس ہوتا ہے جیسے وعدے نبھانے کا وقت آ گیا ہے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          أَيُّ وَعْدٍ هُوَ؟ إِنْ أَذِنْتُمْ لِي، فَهَلْ أَرْوِي لَكُمْ قِصَّةً؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کونسا وعدہ؟ اگر اجازت دیں تو ایک واقعہ سناؤں؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کِہڑا وعدہ؟ جے تُسیں اجازت دیوو، میں اک واقعہ سُناواں؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ٱجْتَمَعَتْ أَرْوَاحُ ثَمَانِيَةَ عَشَرَ أَلْفَ مَخْلُوقٍ، وَصَفَّ
          ٱلْأَنْبِيَاءُ صُفُوفًا، وَقَدْ رَفَعَتِ ٱلتَّوْحِيدُ صَوْتَهَا،
          وَقِيلَ: أُرِيدُ ٱلِٱمْتِحَانَ
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اٹھارہ ہزاری مخلوقاں دیاں روحاں جمع ہوئیاں، نبی صفاں بنا کے کھڑے سن،
          توحید دی صدا بلند ہوئی، تے آواز آئی: "میں امتحان لینا چاہندا واں۔"
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          جَاءَتْ صَوْتُ ٱلتَّوْحِيدِ: مَنْ ٱلَّذِي سَيَصْبِرُ عَلَىٰ فِرَاقِ
          ٱلابْنِ؟ فَقَالَ نَبِيُّ ٱللّٰهِ يَعْقُوبُ: ٱللّٰهُمَّ أَنْتَ
          تَعْلَمُ، يُوسُفِي فِي أَمَانَتِكَ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          آوازِ توحید آئی: "کون ہے جو بیٹے کی جدائی برداشت کرے گا؟" نبی یعقوبؑ
          نے عرض کی: "اے اللہ! تُو جانتا ہے، میرا یوسفؑ تیرے حوالے۔"
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صدا آئی: "کون اے جیہڑا پتر دی جدائی برداشت کرے گا؟" یعقوب نبیؑ آکھی:
          "ربا! تُو جاندا اے، میرا یوسفؑ تیرے سُپرد۔"
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَفِي تِلْكَ ٱللَّحْظَةِ، وُضِعَ ٱلتَّاجُ عَلَىٰ رَأْسِ نَبِيِّ
          ٱللّٰهِ يَعْقُوبَ، جَزَاءً عَلَىٰ صَبْرِهِ وَوَثَاقَةِ إِيمَانِهِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اُس لمحے یعقوبؑ نبی کے سر پر تاج رکھ دیا گیا — اُن کے صبر اور مضبوط
          ایمان کا انعام۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اوہ ویلے یعقوبؑ نبی دے سَر تے تاج رکھیا گیا — اوہ دے صبر تے یقین دی
          بخشش دے طور تے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ثُمَّ جَاءَ صَوْتُ ٱلتَّوْحِيدِ: مَنْ ٱلَّذِي يَصْبِرُ عَلَىٰ
          ٱلزِّنْدَانِ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس کے بعد آوازِ توحید آئی: کون ہے جو زندان برداشت کرے؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فیر آوازِ توحید آئی: کون اے جیہڑا قید برداشت کرے گا؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَقَالَ نَبِيُّ ٱللّٰهِ يُوسُفُ: يَا رَبِّ أَنَا ٱلْعَبْدُ ٱلْحَاضِرُ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          یوسف نبی نے فرمایا: اے میرے اللہ! میں حاضر ہوں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          یوسف نبی آکھیا: میرا اللہ! میں حاضر آں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَوُضِعَ ٱلتَّاجُ عَلَىٰ رَأْسِ يُوسُفَ ٱلصِّدِّيقِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تب تاج جناب یوسفؑ کے سر پر رکھ دیا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تے تاج حضرت یوسفؑ دے سَر تے رکھ دتا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ثُمَّ جَاءَ صَوْتُ ٱلتَّوْحِيدِ: مَنْ ٱلَّذِي يُقَدِّمُ عُنُقَهُ
          لِٱلذَّبْحِ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          پھر آوازِ توحید آئی: کون ہے جو اپنی گردن کٹوانے کو تیار ہے؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فیر صدا آئی: کون اے جیہڑا گردن کٹوان لی تیار اے؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَقَالَ نَبِيُّ ٱللّٰهِ يَحْيَىٰ: يَا رَبِّ أَنَا ٱلْحَاضِرُ
          ٱلْمُطِيعُ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تو نبی یحییٰؑ نے عرض کی: اے میرے رب! میں حاضر ہوں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          یحییٰ نبی آکھی: میرا اللہ! میں حاضر آں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَوُضِعَ ٱلتَّاجُ عَلَىٰ رَأْسِ ٱلنَّبِيِّ يَحْيَىٰ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تو تاج نبی یحییٰؑ کے سر پر رکھ دیا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تاج یحییٰ نبیؑ دے سَر تے رکھ دتا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ثُمَّ جَاءَ صَوْتُ ٱلتَّوْحِيدِ: مَنْ يَذْبَحُ ٱبْنَهُ بِيَدِهِ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          پھر آوازِ توحید آئی: کون ہے جو اپنے ہاتھوں سے اپنے بیٹے کی گردن پر
          چھری چلائے؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فیر صدا آئی: کون اے جیہڑا اپنے پُتر دی گردن تے چھری چلاوے گا؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَقَالَ إِبْرَاهِيمُ: يَا رَبِّ، أَنَا ٱلْعَبْدُ ٱلْمُطِيعُ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تو ابراہیم نبی نے عرض کی: اے میرے رب! میں حاضر ہوں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          حضرت ابراہیمؑ آکھیا: میرا رب! میں وی حاضر آں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَوُضِعَ ٱلتَّاجُ عَلَىٰ رَأْسِ إِبْرَاهِيمَ ٱلْخَلِيلِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تو تاج جناب ابراہیم نبیؑ کے سر پر رکھ دیا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تاج ابراہیم نبیؑ دے سَر تے سجا دتا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ثُمَّ جَاءَ صَوْتُ ٱلتَّوْحِيدِ: مَنْ يُقَدِّمُ أَعْظَمَ
          ٱلِٱمْتِحَانِ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          پھر آواز آئی: کون ہے جو سب سے بڑا امتحان دے گا؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فیر آواز آئی: سب توں وڈا امتحان کون دے گا؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَسَأَلَ ٱلْأَنْبِيَاءُ: يَا رَبِّ، مَا هُوَ هٰذَا ٱلِٱمْتِحَانُ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          انبیاءؑ نے عرض کی: اے رب! وہ کونسا امتحان ہے؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سارے انبیاءؑ پُچھن لگے: مولا! ایہہ کیہڑا امتحان اے؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَقِيلَ: ٱلْخُرُوجُ مِنَ ٱلْوَطَنِ، وَٱلْعُزْلَةُ فِي كَرْبَلَاءَ،
          وَقَتْلُ ٱلضُّيُوفِ وَٱلشَّبَابِ وَٱلْأَطْفَالِ، وَٱلنِّدَاءُ
          بِٱلْمَنْصُورِ وَلَا يُجِيبُهُ أَحَدٌ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          آواز آئی: وطن چھوڑنا، کربلا کے جنگل میں تنہا رہ جانا، مہمانوں، جوانوں
          اور بچوں کا قتل، اور تنہا پکارنا کہ "ہے کوئی مدد کو آنے والا؟" — مگر
          کوئی جواب نہ دے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صدا آئی: وطن چھڈنا، کربلا دے جنگل وچ اکیلا رہ جانا، مہمان مارے جانا،
          جوان مارے جانا، نادان معصوم مارے جانا، تے اک ہو کے آواز مارنا — ہے
          کوئی مددگار؟ — تے کوئی جواب نہ آئے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَصَمَتَ ٱلْأَنْبِيَاءُ، وَقَامَ ٱلْحُسَيْنُ، فَقَالَ: يَا رَبِّ،
          أَنَا ٱلصَّابِرُ ٱلْمُضَحِّي
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سب انبیاء خاموش ہو گئے۔ امام حسینؑ کھڑے ہوئے اور عرض کی: اے اللہ! میں
          کربلا جانتا ہوں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سارے نبی چپ ہو گئے۔ حسینؑ کھڑے ہو گئے، آکھیا: میرا اللہ! میں جاننا واں
          کربلا جانا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَوُضِعَ ٱلتَّاجُ عَلَىٰ رَأْسِ جَدِّهِ ٱلنَّبِيِّ ٱلْكَرِيمِ ﷺ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تاج نانا محمد مصطفیٰ ﷺ کے سر پر رکھ دیا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ثُمَّ جَاءَ صَوْتُ ٱلتَّوْحِيدِ: مَنْ يُسْلِمُ بَنَاتِهِ وَأَخَوَاتِهِ
          لِلسَّبْيِ؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          پھر آوازِ توحید آئی: کون ہے جو اپنی بیٹیوں اور بہنوں کو قید کروائے گا؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فیر آواز آئی: کون اے جیہڑا اپنے گھر دیاں دھیواں تے پہناں نوں قید کراوے
          گا؟
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَسَكَتَ ٱلْجَمِيعُ، وَبَدَأَ ٱلتَّاجُ يَنْزِلُ عَنْ رَأْسِ ٱلنَّبِيِّ
          ٱلْكَرِيمِ ﷺ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سب خاموش ہو گئے، اور نبی کریم ﷺ کے سر سے تاج اترنے لگا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سارے چُپ ہو گئے، تے نبیؐ دے سَر توں تاج ہلن لگ پیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَقَامَتْ أُمُّ ٱلْمَصَائِبِ، فَنَادَتْ: يَا جَدِّي، ٱلْبَسْ تَاجَكَ،
          أَنَا ٱلذَّاهِبَةُ إِلَىٰ أَسْوَاقِ ٱلشَّامِ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس وقت اُمُّ المصائب سلامُ اللہ علیہا کھڑی ہوئیں اور فرمایا: نانا! تاج
          پہنو، میں جانتی ہوں، مجھے شام کے بازاروں میں جانا ہے۔
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          میں سمجھیا ہا اجاں وسدے پئے او تے ساڈے اجڑن دی رت دور اے <br></br>
          جے آگئ اے غربت ویرن کو خوش تھی کے منظور اے<br></br>
          خیال کریں متاں بیعت کیتے تیکوں لوگ کرن مجبور اے <br></br>
          کریں صاف انکار پئو وانگوں مینوں قید تھیون منظور اے
        </span>
      ),
    },

    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اجاں کتنا ٹرنا اے میں تھک پئ آن میکوں دس تو چن زہرا دا <br></br> تسی
          جاندے اور میں اج تائیں کدی نہیں ٹری پیر پیادہ<br></br>میں قبر نانے تے
          ویندی آں گھن آسرا ماں فضہ دا<br></br>مینڈے پیراں تے آ ورم گئے وچ
          گھر دے پئیو صغرا دا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          غازی آدھا اے جہڑی ٹر نہیں سنگدی وچ ویڑے دے کیوٰں پیدا سفر کریسی{" "}
          <br></br> او بعد عباس تے اکبر دے کیویں شرابیاں نال بلیسی
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

export default ThirdMoharram;

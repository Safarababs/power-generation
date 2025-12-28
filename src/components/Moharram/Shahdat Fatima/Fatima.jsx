import "arabic-fonts/src/css/arabic-fonts.css";
import { CTable } from "@coreui/react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { useRef } from "react";

const Fatima = () => {
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
          أُدلِي لِلْمُغَيَّبِ تَحْتَ أَطْبَاقِ الثَّرَى، إِنْ كُنْتَ تَسْمَعُ
          صَرْخَتِي وَنِدَائِيَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اُس چھپے ہوئے (مدفون) سے فریاد کر رہی ہوں — اگر تُو میری چیخ اور پکار
          کو سنتا ہے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صُبَّتْ عَلَيَّ مَصَائِبٌ لَوْ أَنَّهَا، صُبَّتْ عَلَى الْأَيَّامِ
          صِرْنَ لَيَالِيَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مجھ پر ایسی مصیبتیں نازل ہوئیں کہ اگر وہ دنوں پر پڑتیں تو وہ راتوں میں
          بدل جاتے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          قَدْ كُنْتُ ذَاتَ حِمًى بِظِلِّ مُحَمَّدٍ، لَا أَخْشَى مِنْ ضَيْمٍ
          وَكَانَ جِمَالِيَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          میں محمد ﷺ کے سائے میں ایک معزز ہستی تھی، کسی ظلم کا اندیشہ نہ تھا،
          اور یہی میرا حسن تھا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَالْيَوْمَ أَخْشَعُ لِلذَّلِيلِ وَأَتَّقِي، ضَيْمِي وَأَدْفَعُ
          ظَالِمِي بِرِدَائِيَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اور آج میں ذلیلوں کے سامنے جھکنے لگی ہوں، ظلم سے ڈرنے لگی ہوں، اور
          اپنی چادر سے ظالم کو روکتی ہوں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَإِذَا بَكَتْ قُمْرِيَّةٌ فِي لَيْلِهَا، شَجَنًا عَلَى غُصْنٍ
          بَكَيْتُ صَبَاحِيَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اگر رات کو کوئی فاختہ شاخ پر غم سے روئے، تو میں صبح ہی سے رونا شروع کر
          دیتی ہوں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَلَأَجْعَلَنَّ الْحُزْنَ بَعْدَكَ مُؤْنِسِي، وَلَأَجْعَلَنَّ
          الدَّمْعَ فِيكَ وِشَاحِيَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تیرے بعد میں غم کو اپنا ساتھی بنا لوں گی، اور تیرے لیے آنسوؤں کو اپنی
          زینت کر لوں گی۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          مَاذَا عَلَى مَنْ شَمَّ تُرْبَةَ أَحْمَدٍ، أَنْ لَا يَشُمَّ مُدَى
          الزَّمَانِ غَوَالِيَا
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          جو کوئی احمد ﷺ کی مٹی کو سونگھ لے، اُس پر کیا ملامت ہے اگر وہ کبھی
          خوشبوؤں کو سونگھنے کا طالب نہ رہے؟
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

export default Fatima;

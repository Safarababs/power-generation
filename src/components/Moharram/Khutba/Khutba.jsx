import "arabic-fonts/src/css/arabic-fonts.css";
import { CTable } from "@coreui/react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { useRef } from "react";

const Khutba = () => {
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
    },
    {
      class: (
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
          ٱلْـحَمْدُ لِلّٰهِ ٱلَّذِي جَعَلَنَا مِنَ ٱلْمُتَـمَسِّكِينَ
          بِوَلَايَةِ أَمِيرِ ٱلْمُؤْمِنِينَ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تمام تعریفیں اللہ کے لیے ہیں، جس نے ہمیں ولایتِ امیرالمؤمنین سے وابستہ
          رکھا۔
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
          مُحَمَّدٍۢ
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          تمام تعریفیں اللہ کے لیے ہیں، جس نے ہمارے دلوں کو آلِ محمدؐ کی ولایت
          سے منور کیا۔
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
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          درود و سلام ہو ہمارے سردار محمدؐ اور ان کے پاکیزہ اہلِ بیتؑ پر۔
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
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اور ان کے تمام دشمنوں پر ہمیشہ کی لعنت ہو۔
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
    },
    {
      class: (
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
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اللہ کا درود ہو ہمارے سردار اور نبی، ابو القاسم محمدؐ پر۔
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
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اللہ کا درود ہو آپ پر، اے ہمارے مولا، اے اللہ کے رسولؐ۔
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
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اللہ کا درود ہو آپ پر، اے ہمارے مولا، اے ہمارے مولا کے فرزند، اے ابا
          عبد اللہؑ۔
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
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اللہ کا درود ہو آپ پر، اے شیر خوار کے بابا، جو آپ کی چھاتی پر ذبح کیا
          گیا، اے حسینؑ!
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
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          کاش ہم بھی آپ کے ساتھ ہوتے تو عظیم کامیابی حاصل کرتے۔
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

export default Khutba;

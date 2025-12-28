import "arabic-fonts/src/css/arabic-fonts.css";
import { CTable } from "@coreui/react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { useRef } from "react";

const AliAsghar = () => {
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
          اَلسَّلامُ عَلَيْكَ يَا طِفْلَ الْعَطْشَانِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر اے پیاسے بچے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اَلسَّلامُ عَلَيْكَ يَا رَضِيعَ الْحُسَيْنِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر اے حسین کے شیرخوار۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اَلسَّلامُ عَلَيْكَ يَا ذَبِيحَ الْفُرَاتِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر اے فرات (کے کنارے) ذبح کیے گئے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اَلسَّلامُ عَلَيْكَ يَا مَظْلُومَ كَرْبَلاءَ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر اے کربلا کے مظلوم۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اَلسَّلامُ عَلَيْكَ يَا بَابَ الْحَوَائِجِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو آپ پر اے حاجتوں کے دروازے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اَلسَّلامُ عَلَى الْمُرَمَّلِ بِالدَّمِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو اس پر جو خون میں لت پت تھا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اَلسَّلامُ عَلَى الْمَقْطُوعِ الْوَتِينِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سلام ہو اس پر جس کی رگِ گردن کاٹ دی گئی۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          سَقَاهُ الْقَوْمُ سَهْمًا بَدَلَ الْمَاءِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          قوم نے اسے پانی کے بجائے تیر پلایا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          رُمِيَ بِسَهْمٍ ذِي ثَلاَثِ شُعَبٍ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اسے تین پھل والے تیر سے مارا گیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          لَمْ يَشْرَبِ الْمَاءَ وَهُوَ عَطْشَانٌ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس نے پانی نہیں پیا جبکہ وہ پیاسا تھا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          بَكَى الْحُسَيْنُ عَلَى رَضِيعِهِ الْمَذْبُوحِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          حسینؑ اپنے ذبح شدہ شیرخوار پر روئے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          أَلْقَاهُ أَبُوهُ مُلَطَّخًا بِالدَّمِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس کے والد نے اسے خون میں لت پت پایا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          حَمَلَهُ الْحُسَيْنُ لِيَطْلُبَ لَهُ الْمَاءَ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          حسینؑ اسے اٹھا کر لے گئے تاکہ اس کے لیے پانی مانگیں۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          وَجَدَ السَّهْمَ فِي حَلْقِهِ الشَّرِيفِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          (امام حسینؑ نے) تیر کو اس کے مبارک حلق میں پایا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          فَاضَتْ رُوحُهُ فِي أَحْضَانِ أَبِيهِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس کی روح اپنے والد کی آغوش میں پرواز کر گئی۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          رَضِيعٌ لَمْ يَرْتَوِ مِنْ مَاءٍ قَطُّ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          ایک شیرخوار جس نے کبھی پانی نہیں پیا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          قَتَلُوهُ وَهُوَ يَشْكُو الْعَطَشَ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          انہوں نے اسے قتل کیا جبکہ وہ پیاس کی شکایت کر رہا تھا۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          دَمُهُ الطَّاهِرُ شَاهِدٌ عَلَى ظُلْمِهِمْ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اس کا پاکیزہ خون ان کے ظلم پر گواہ ہے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          لَعَنَ اللَّهُ قَاتِلِيهِ وَمُبْغِضِيهِ.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          اللہ ان کے قاتلوں اور دشمنوں پر لعنت کرے۔
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-muhammadi text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          صَبْرُ الْحُسَيْنِ عَلَى فَقْدِهِ كَانَ عَظِيمًا.
        </span>
      ),
    },
    {
      class: (
        <span
          className="font-urdu text-line-height"
          style={{ textAlign: "right", display: "block" }}
        >
          امام حسینؑ کا اس (اصغر) کے غم پر صبر عظیم تھا۔
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

export default AliAsghar;

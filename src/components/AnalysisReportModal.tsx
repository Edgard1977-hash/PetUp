import { motion } from "motion/react";
import { AnalysisReport, Pet } from "../types";
import { X, CheckCircle, AlertTriangle, AlertCircle, Sparkles, Apple, RefreshCw, Eye, ShieldAlert, Activity } from "lucide-react";

interface AnalysisReportModalProps {
  report: AnalysisReport;
  pet: Pet;
  onClose: () => void;
  currentLanguage?: string;
}

const REPORT_TRANSLATIONS: Record<string, any> = {
  en: {
    AiAnalysis: "AI Analysis",
    Index: "Index",
    ScanFrom: "Scan from",
    GeneralCondition: "General Condition",
    PotentialIssues: "Potential Issues",
    NoIssues: "No issues detected",
    VetWarning: "* Preliminary screening. In-person vet visit is required.",
    VisualResults: "Visual Screening Results",
    Normal: "Normal",
    Warning: "Warning",
    Critical: "Critical",
    RecommendedActions: "Recommended Actions",
    DietHydration: "Diet & Hydration",
    Monitoring: "Monitoring (next 24-48h)",
    PhotoUsed: "Analyzed Photo",
    CloseReport: "Got it, close report",
    Excellent: "Excellent",
    Healthy: "Healthy",
    NeedsAttention: "Needs Attention",
    VetRecommended: "Vet Recommended"
  },
  ru: {
    AiAnalysis: "Анализ ИИ",
    Index: "Индекс",
    ScanFrom: "Осмотр от",
    GeneralCondition: "Общее состояние",
    PotentialIssues: "Возможные заболевания",
    NoIssues: "Патологий не обнаружено",
    VetWarning: "* Предварительный скрининг по фото. Требуется очный визит к врачу.",
    VisualResults: "Результаты визуального осмотра",
    Normal: "Норма",
    Warning: "Внимание",
    Critical: "Критично",
    RecommendedActions: "Рекомендованные действия ветеринара",
    DietHydration: "Питание и питьевой режим",
    Monitoring: "Мониторинг в следующие 24-48 часов",
    PhotoUsed: "Фотография для анализа",
    CloseReport: "Понятно, закрыть отчет",
    Excellent: "Отличное",
    Healthy: "В норме",
    NeedsAttention: "Требует внимания",
    VetRecommended: "Рекомендуется ветеринар"
  },
  fr: {
    AiAnalysis: "Analyse IA",
    Index: "Indice",
    ScanFrom: "Analyse du",
    GeneralCondition: "État général",
    PotentialIssues: "Problèmes potentiels",
    NoIssues: "Aucun problème détecté",
    VetWarning: "* Dépistage préliminaire. Une visite chez le vétérinaire est requise.",
    VisualResults: "Résultats du dépistage visuel",
    Normal: "Normal",
    Warning: "Attention",
    Critical: "Critique",
    RecommendedActions: "Actions recommandées",
    DietHydration: "Alimentation et hydratation",
    Monitoring: "Surveillance (prochaines 24-48h)",
    PhotoUsed: "Photo analysée",
    CloseReport: "Compris, fermer le rapport",
    Excellent: "Excellent",
    Healthy: "Sain",
    NeedsAttention: "Attention requise",
    VetRecommended: "Vétérinaire recommandé"
  },
  de: {
    AiAnalysis: "KI-Analyse",
    Index: "Index",
    ScanFrom: "Scan vom",
    GeneralCondition: "Allgemeinzustand",
    PotentialIssues: "Mögliche Probleme",
    NoIssues: "Keine Probleme erkannt",
    VetWarning: "* Vorläufiges Screening. Ein Tierarztbesuch ist erforderlich.",
    VisualResults: "Visuelle Screening-Ergebnisse",
    Normal: "Normal",
    Warning: "Warnung",
    Critical: "Kritisch",
    RecommendedActions: "Empfohlene Maßnahmen",
    DietHydration: "Ernährung & Hydration",
    Monitoring: "Überwachung (nächste 24-48h)",
    PhotoUsed: "Analysiertes Foto",
    CloseReport: "Verstanden, Bericht schließen",
    Excellent: "Hervorragend",
    Healthy: "Gesund",
    NeedsAttention: "Aufmerksamkeit erforderlich",
    VetRecommended: "Tierarzt empfohlen"
  },
  es: {
    AiAnalysis: "Análisis IA",
    Index: "Índice",
    ScanFrom: "Análisis del",
    GeneralCondition: "Estado general",
    PotentialIssues: "Problemas potenciales",
    NoIssues: "No se detectaron problemas",
    VetWarning: "* Evaluación preliminar. Se requiere visita veterinaria presencial.",
    VisualResults: "Resultados del examen visual",
    Normal: "Normal",
    Warning: "Advertencia",
    Critical: "Crítico",
    RecommendedActions: "Acciones recomendadas",
    DietHydration: "Dieta e hidratación",
    Monitoring: "Monitoreo (próximas 24-48h)",
    PhotoUsed: "Foto analizada",
    CloseReport: "Entendido, cerrar informe",
    Excellent: "Excelente",
    Healthy: "Saludable",
    NeedsAttention: "Requiere atención",
    VetRecommended: "Veterinario recomendado"
  },
  it: {
    AiAnalysis: "Analisi IA",
    Index: "Indice",
    ScanFrom: "Analisi del",
    GeneralCondition: "Stato generale",
    PotentialIssues: "Potenziali problemi",
    NoIssues: "Nessun problema rilevato",
    VetWarning: "* Screening preliminare. È richiesta una visita veterinaria di persona.",
    VisualResults: "Risultati dello screening visivo",
    Normal: "Normale",
    Warning: "Attenzione",
    Critical: "Critico",
    RecommendedActions: "Azioni raccomandate",
    DietHydration: "Dieta e idratazione",
    Monitoring: "Monitoraggio (prossime 24-48 ore)",
    PhotoUsed: "Foto analizzata",
    CloseReport: "Ho capito, chiudi rapporto",
    Excellent: "Eccellente",
    Healthy: "Sano",
    NeedsAttention: "Richiede attenzione",
    VetRecommended: "Consigliato veterinario"
  },
  ja: {
    AiAnalysis: "AI分析",
    Index: "指数",
    ScanFrom: "スキャン日:",
    GeneralCondition: "一般状態",
    PotentialIssues: "潜在的な問題",
    NoIssues: "問題は検出されませんでした",
    VetWarning: "* 簡易スクリーニングです。獣医師の診察を推奨します。",
    VisualResults: "視覚的スクリーニング結果",
    Normal: "正常",
    Warning: "注意",
    Critical: "重篤",
    RecommendedActions: "推奨される対策",
    DietHydration: "食事と水分補給",
    Monitoring: "経過観察 (24-48時間以内)",
    PhotoUsed: "分析された写真",
    CloseReport: "閉じる",
    Excellent: "極めて良好",
    Healthy: "正常",
    NeedsAttention: "要経過観察",
    VetRecommended: "獣医師への相談推奨"
  },
  ko: {
    AiAnalysis: "AI 분석",
    Index: "지수",
    ScanFrom: "분석일:",
    GeneralCondition: "일반 상태",
    PotentialIssues: "잠재적 문제",
    NoIssues: "감지된 문제 없음",
    VetWarning: "* 예비 스크리닝 결과입니다. 수의사 진찰이 필요합니다.",
    VisualResults: "시각적 스크리닝 결과",
    Normal: "정상",
    Warning: "주의",
    Critical: "심각",
    RecommendedActions: "권장 조치",
    DietHydration: "식사 및 수분 섭취",
    Monitoring: "모니터링 (향후 24-48시간)",
    PhotoUsed: "분석된 사진",
    CloseReport: "확인, 보고서 닫기",
    Excellent: "매우 우수",
    Healthy: "정상",
    NeedsAttention: "주의 필요",
    VetRecommended: "수의사 진료 권장"
  },
  zh: {
    AiAnalysis: "AI 分析",
    Index: "指数",
    ScanFrom: "扫描日期:",
    GeneralCondition: "一般状况",
    PotentialIssues: "潜在问题",
    NoIssues: "未检测到异常",
    VetWarning: "* 仅为初步筛查。建议线下就医。",
    VisualResults: "外观筛查结果",
    Normal: "正常",
    Warning: "警告",
    Critical: "严重",
    RecommendedActions: "建议采取的行动",
    DietHydration: "饮食与饮水建议",
    Monitoring: "持续观察 (未来24-48小时)",
    PhotoUsed: "分析的照片",
    CloseReport: "已了解，关闭报告",
    Excellent: "极佳",
    Healthy: "正常",
    NeedsAttention: "需要关注",
    VetRecommended: "建议就医"
  },
  "pt-BR": {
    AiAnalysis: "Análise de IA",
    Index: "Índice",
    ScanFrom: "Análise de",
    GeneralCondition: "Estado Geral",
    PotentialIssues: "Problemas Potenciais",
    NoIssues: "Nenhum problema detectado",
    VetWarning: "* Triagem preliminar. Recomenda-se consulta presencial com veterinário.",
    VisualResults: "Resultados da Triagem Visual",
    Normal: "Normal",
    Warning: "Aviso",
    Critical: "Crítico",
    RecommendedActions: "Ações Recomendadas",
    DietHydration: "Dieta e Hidratação",
    Monitoring: "Monitoramento (próximas 24-48h)",
    PhotoUsed: "Foto Analisada",
    CloseReport: "Entendido, fechar relatório",
    Excellent: "Excelente",
    Healthy: "Saudável",
    NeedsAttention: "Requer Atenção",
    VetRecommended: "Veterinário Recomendado"
  }
};

export default function AnalysisReportModal({ report, pet, onClose, currentLanguage = "en" }: AnalysisReportModalProps) {
  const lang = currentLanguage || "en";
  const t = REPORT_TRANSLATIONS[lang] || REPORT_TRANSLATIONS.en;

  // Circular gauge calculations
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (report.healthScore / 100) * circumference;

  // Determine color theme based on score (matching exact percentage thresholds: <50 red, <75 orange, <90 yellow, >=90 bright green)
  const getThemeColor = (score: number) => {
    if (score >= 90) return { primary: "#30D158", bg: "#eafaf1", text: "#166534", label: t.Excellent };
    if (score >= 75) return { primary: "#FFCC00", bg: "#fefce8", text: "#854d0e", label: t.Healthy };
    if (score >= 50) return { primary: "#FF9500", bg: "#fff7ed", text: "#9a3412", label: t.NeedsAttention };
    return { primary: "#FF3B30", bg: "#fef2f2", text: "#991b1b", label: t.VetRecommended };
  };

  const theme = getThemeColor(report.healthScore);

  return (
    <div id="report-modal-backdrop" className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-end justify-center p-0">
      {/* Semi-transparent Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide up sheet container - strict bottom sheet shape and max-w-md matching Symptoms list */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0 }}
        dragSnapToOrigin={true}
        dragElastic={{ top: 0.05, bottom: 0.95 }}
        onDragEnd={(_event, info) => {
          if (info.offset.y > 45 || info.velocity.y > 120) {
            onClose();
          }
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-t-[2.5rem] p-6 pt-5 shadow-2xl relative z-10 flex flex-col max-h-[85vh] overflow-hidden text-[#1c1c1e] dark:text-white"
        id="report-modal-content"
      >
        {/* Modal Header without bottom line to stay clean */}
        <div className="flex justify-between items-center mb-5 cursor-grab active:cursor-grabbing touch-none select-none">
          <div className="flex items-center gap-1.5">
            <Sparkles size={18} className="text-[#5856d6] dark:text-indigo-400" />
            <h3 className="text-base font-extrabold text-[#1c1c1e] dark:text-white">
              {t.AiAnalysis}: <span className="text-[#5856d6] dark:text-indigo-400">{pet.name}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-[#2C2C2E] flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-[#3A3A3C] cursor-pointer"
          >
            <X size={14} className="text-zinc-600 dark:text-white" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 pb-4">
          {/* Top Score Overview Card */}
          <div className="bg-zinc-50 dark:bg-[#202022] p-4 rounded-2xl border border-zinc-100 dark:border-0 flex flex-col sm:flex-row items-center gap-4">
            {/* SVG Circular Gauge */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  className="chart-track-ring stroke-[#E5E5EA] dark:stroke-[#3A3A3C]"
                  stroke="#E5E5EA"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                {/* Colored Progress Ring */}
                <motion.circle
                  stroke={theme.primary}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + " " + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              {/* Inner score text */}
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black font-mono leading-none text-[#1c1c1e] dark:text-white">{report.healthScore}</span>
                <span className="text-[8px] text-zinc-400 dark:text-[#98989D] uppercase tracking-widest font-bold">{t.Index}</span>
              </div>
            </div>

            {/* Assessment Text Box */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row items-center gap-1.5">
                <span
                  style={{ backgroundColor: theme.bg, color: theme.text }}
                  className="text-[10px] font-black px-2.5 py-1 rounded-full inline-block uppercase tracking-wider"
                >
                  {report.statusLabel || theme.label}
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 dark:text-[#98989D]">
                  {t.ScanFrom} {new Date(report.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-600 dark:text-[#98989D] leading-relaxed">
                {report.summary}
              </p>
            </div>
          </div>

          {/* General Clinical Assessment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* General Condition Card */}
            <div className="bg-gradient-to-br from-rose-50/40 to-rose-50/10 dark:from-rose-950/40 dark:to-rose-950/20 p-4 rounded-2xl border border-rose-100/50 dark:border-rose-900/30 space-y-1.5">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-rose-600 animate-pulse" />
                {t.GeneralCondition}:
              </h4>
              <p className="text-xs text-zinc-700 dark:text-white leading-relaxed font-semibold">
                {report.generalCondition || (lang === "ru" ? "Стабильное, без видимых патологических изменений на фото." : "Stable, without visible abnormalities on the photo.")}
              </p>
            </div>

            {/* Potential Diseases Card */}
            <div className="bg-gradient-to-br from-amber-50/40 to-amber-50/10 dark:from-amber-950/40 dark:to-amber-950/20 p-4 rounded-2xl border border-amber-100/50 dark:border-amber-900/30 space-y-1.5">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-600" />
                {t.PotentialIssues}:
              </h4>
              {report.possibleDiseases && report.possibleDiseases.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {report.possibleDiseases.map((disease, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-amber-100/70 dark:bg-amber-900/40 border border-amber-200/50 dark:border-amber-700/40 text-amber-800 dark:text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md"
                      >
                        {disease}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-zinc-400 dark:text-[#98989D] font-medium leading-tight">
                    {t.VetWarning}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-bold py-1">
                  <CheckCircle size={14} className="text-green-600" />
                  {t.NoIssues}
                </div>
              )}
            </div>
          </div>

          {/* Visual Findings Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-[#98989D] flex items-center gap-1.5 px-1">
              <Eye size={14} className="text-indigo-500" />
              {t.VisualResults}:
            </h4>

            <div className="space-y-2">
              {report.findings.map((finding, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#202022] p-3.5 rounded-2xl border border-zinc-100 dark:border-0 shadow-3xs flex gap-3"
                >
                  <div className="mt-0.5 shrink-0">
                    {finding.status === "good" ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : finding.status === "warning" ? (
                      <AlertTriangle size={16} className="text-amber-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-bold text-[#1c1c1e] dark:text-white truncate">{finding.category}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shrink-0 ${
                        finding.status === "good"
                          ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300"
                          : finding.status === "warning"
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
                          : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                      }`}>
                        {finding.status === "good" ? t.Normal : finding.status === "warning" ? t.Warning : t.Critical}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-[#98989D] leading-relaxed">{finding.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Checklist */}
          <div className="bg-indigo-50/25 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-500 animate-pulse" />
              {t.RecommendedActions}:
            </h4>
            <ul className="space-y-2">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-zinc-600 dark:text-white leading-relaxed font-medium">
                  <span className="h-5 w-5 bg-indigo-50 dark:bg-indigo-900/50 text-[#5856d6] dark:text-indigo-300 font-bold text-[10px] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diet and Hydration Card */}
          <div className="bg-amber-50/30 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-100/50 dark:border-amber-900/30 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Apple size={14} className="text-amber-600" />
              {t.DietHydration}:
            </h4>
            <p className="text-xs text-amber-800 dark:text-white leading-relaxed font-medium">
              {report.dietAdvice}
            </p>
          </div>

          {/* Follow-up Tracking Card */}
          <div className="bg-sky-50/30 dark:bg-sky-950/30 p-4 rounded-2xl border border-sky-100/50 dark:border-sky-900/30 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
              <RefreshCw size={14} className="text-sky-600" />
              {t.Monitoring}:
            </h4>
            <p className="text-xs text-sky-800 dark:text-white leading-relaxed font-medium">
              {report.followUp}
            </p>
          </div>

          {/* Photo Used reference */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-[#98989D] block px-1">{t.PhotoUsed}:</span>
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-zinc-150">
              <img src={report.photo} alt="Analyzed pet" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Modal Footer closer with standard premium button */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#1c1c1e]">
          <button
            onClick={onClose}
            className="w-full bg-[#1c1c1e] dark:bg-white hover:bg-black dark:hover:bg-zinc-200 text-white dark:text-black font-extrabold py-3.5 rounded-2xl transition-colors cursor-pointer text-center text-sm"
          >
            {t.CloseReport}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

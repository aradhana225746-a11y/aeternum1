import ReadAloudButton from './ReadAloudButton';
import { useTranslation } from '../context/TranslationContext';

const CERVICAL_TEXT = `Cervical cancer is one of the most preventable cancers when detected early. Regular Pap smear tests (every 3 years from age 21, or as advised by your doctor) are the single best way to catch changes early. HPV vaccination is recommended for young women — it protects against the most common strains that cause cervical cancer. Watch for: irregular bleeding between periods, bleeding after intercourse, persistent pelvic pain, or unusual vaginal discharge. These symptoms don't necessarily mean cancer, but they do deserve a doctor's attention. Early screening saves lives. If you haven't had a Pap smear recently, consider scheduling one soon.`;

export default function CervicalHealth() {
  const { t } = useTranslation();

  return (
    <div className="mt-10">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-pink-800 mb-1">
          {t('cervicalTitle')}
        </h3>
        <p className="text-sm text-pink-400 mb-4">
          {t('cervicalSub')}
        </p>
        <ReadAloudButton text={CERVICAL_TEXT} label="Listen" />
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-sm text-pink-700 leading-relaxed">
          Cervical cancer is one of the most preventable cancers when detected early.
          Regular <strong className="text-pink-800">Pap smear tests</strong> — every 3 years
          from age 21, or as your doctor advises — are the best way to catch changes early.
        </p>

        <div className="py-4">
          <h4 className="text-sm font-semibold text-pink-700 mb-3">HPV Awareness</h4>
          <p className="text-sm text-pink-500 leading-relaxed">
            <strong className="text-pink-700">HPV (Human Papillomavirus)</strong> vaccination
            is recommended for young women. It protects against the most common strains that
            can lead to cervical cancer. If you haven't been vaccinated, it's worth discussing
            with your doctor — it's never too late to ask.
          </p>
        </div>

        <div className="py-4">
          <h4 className="text-sm font-semibold text-pink-700 mb-3">Symptoms to notice</h4>
          <ul className="space-y-2 text-sm text-pink-500">
            {[
              'Irregular bleeding between periods',
              'Bleeding after intercourse',
              'Persistent pelvic pain',
              'Unusual vaginal discharge',
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-pink-400 mt-3 italic">
            These symptoms don't necessarily mean cancer — but they do deserve a doctor's attention.
          </p>
        </div>

        <div className="border-l-2 border-pink-300 pl-4 py-2">
          <h4 className="text-sm font-semibold text-pink-700 mb-1">{t('screeningReminder')}</h4>
          <p className="text-xs text-pink-500/80">
            If you haven't had a Pap smear recently, consider scheduling one.
            Early screening saves lives — and it only takes a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';

const spring = (stiff, damp) => ({ type: 'spring', stiffness: stiff, damping: damp });

// state: 'idle' | 'lifting' | 'success' | 'fail'
export default function DeadliftAnimation({ state = 'idle' }) {
    const lifting = state === 'lifting' || state === 'success';
    const fail = state === 'fail';
    const idle = state === 'idle';

    const barY = lifting ? -34 : fail ? 22 : 0;
    const barRotate = fail ? 10 : 0;
    const bodyY = lifting ? -14 : fail ? 8 : 0;

    return (
        <div className="flex flex-col items-center select-none gap-2">
            <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* ===== FLOOR ===== */}
                <rect x="0" y="178" width="200" height="6" rx="3" fill="#374151" />
                <rect x="20" y="176" width="160" height="3" rx="1" fill="#4b5563" opacity="0.5" />

                {/* ===== BARBELL GROUP ===== */}
                <motion.g
                    animate={{ y: barY, rotate: barRotate }}
                    transition={spring(220, 22)}
                    style={{ originX: '100px', originY: '120px' }}
                >
                    {/* Left collar */}
                    <rect x="28" y="110" width="10" height="22" rx="2" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                    {/* Left small plate */}
                    <rect x="14" y="107" width="14" height="28" rx="3" fill={fail ? '#dc2626' : '#9ca3af'} stroke="#6b7280" strokeWidth="1.5" />
                    {/* Left large plate */}
                    <rect x="2" y="103" width="14" height="36" rx="4" fill={fail ? '#ef4444' : '#d1d5db'} stroke="#9ca3af" strokeWidth="1.5" />

                    {/* Right collar */}
                    <rect x="162" y="110" width="10" height="22" rx="2" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                    {/* Right small plate */}
                    <rect x="172" y="107" width="14" height="28" rx="3" fill={fail ? '#dc2626' : '#9ca3af'} stroke="#6b7280" strokeWidth="1.5" />
                    {/* Right large plate */}
                    <rect x="184" y="103" width="14" height="36" rx="4" fill={fail ? '#ef4444' : '#d1d5db'} stroke="#9ca3af" strokeWidth="1.5" />

                    {/* Bar rod */}
                    <rect x="38" y="117" width="124" height="8" rx="4" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
                    {/* Knurling */}
                    {[60, 74, 88, 102, 116, 130].map(x => (
                        <rect key={x} x={x} y="118.5" width="4" height="5" rx="1" fill="#4b5563" opacity="0.6" />
                    ))}
                    {/* Bar shine */}
                    <rect x="38" y="117.5" width="124" height="2" rx="1" fill="white" opacity="0.15" />
                </motion.g>

                {/* ===== BODY GROUP ===== */}
                <motion.g
                    animate={{ y: bodyY }}
                    transition={spring(180, 20)}
                >
                    {/* — Legs — */}
                    <motion.g
                        animate={lifting ? { rotate: -8 } : fail ? { rotate: 5 } : { rotate: 0 }}
                        style={{ transformOrigin: '100px 140px' }}
                        transition={spring(160, 18)}
                    >
                        {/* Left thigh */}
                        <path
                            d={lifting ? 'M88 140 Q82 158 76 174' : fail ? 'M88 140 Q80 160 72 178' : 'M88 140 Q82 158 76 176'}
                            stroke="#1f2937" strokeWidth="14" strokeLinecap="round" fill="none"
                        />
                        {/* Right thigh */}
                        <path
                            d={lifting ? 'M112 140 Q118 158 124 174' : fail ? 'M112 140 Q120 160 128 178' : 'M112 140 Q118 158 124 176'}
                            stroke="#1f2937" strokeWidth="14" strokeLinecap="round" fill="none"
                        />
                        {/* Left shoe */}
                        <ellipse cx={lifting ? 74 : fail ? 70 : 74} cy="177" rx="13" ry="6" fill="#111827" />
                        <rect x={lifting ? 61 : fail ? 57 : 61} y="172" width="20" height="8" rx="4" fill="#1f2937" />
                        {/* Right shoe */}
                        <ellipse cx={lifting ? 126 : fail ? 130 : 126} cy="177" rx="13" ry="6" fill="#111827" />
                        <rect x={lifting ? 119 : fail ? 123 : 119} y="172" width="20" height="8" rx="4" fill="#1f2937" />
                    </motion.g>

                    {/* — Torso — */}
                    <motion.g
                        animate={lifting ? { rotate: 6 } : fail ? { rotate: -4 } : { rotate: 0 }}
                        style={{ transformOrigin: '100px 110px' }}
                        transition={spring(200, 20)}
                    >
                        {/* Body/shirt */}
                        <motion.rect
                            x="76" y="96" width="48" height="50" rx="10"
                            fill={lifting ? '#b91c1c' : fail ? '#6b7280' : '#ef4444'}
                            stroke={lifting ? '#7f1d1d' : fail ? '#4b5563' : '#dc2626'}
                            strokeWidth="2"
                        />
                        {/* Shirt collar */}
                        <path d="M92 96 Q100 103 108 96" stroke={lifting ? '#7f1d1d' : fail ? '#4b5563' : '#dc2626'} strokeWidth="2" fill="none" />
                        {/* Belt highlight */}
                        <rect x="76" y="130" width="48" height="8" rx="0" fill={lifting ? '#7f1d1d' : fail ? '#374151' : '#dc2626'} opacity="0.5" />

                        {/* — Arms — */}
                        <motion.g
                            animate={lifting ? { rotate: -30 } : fail ? { rotate: 18 } : { rotate: 0 }}
                            style={{ transformOrigin: '100px 108px' }}
                            transition={spring(200, 20)}
                        >
                            {/* Left upper arm */}
                            <path
                                d={lifting ? 'M82 100 Q66 108 50 122' : fail ? 'M82 108 Q62 118 42 132' : 'M82 104 Q64 114 46 128'}
                                stroke="#fbbf24" strokeWidth="11" strokeLinecap="round" fill="none"
                            />
                            {/* Left forearm */}
                            <path
                                d={lifting ? 'M50 122 Q42 128 36 122' : fail ? 'M42 132 Q34 138 28 132' : 'M46 128 Q38 134 34 126'}
                                stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" fill="none"
                            />
                            {/* Right upper arm */}
                            <path
                                d={lifting ? 'M118 100 Q134 108 150 122' : fail ? 'M118 108 Q138 118 158 132' : 'M118 104 Q136 114 154 128'}
                                stroke="#fbbf24" strokeWidth="11" strokeLinecap="round" fill="none"
                            />
                            {/* Right forearm */}
                            <path
                                d={lifting ? 'M150 122 Q158 128 164 122' : fail ? 'M158 132 Q166 138 172 132' : 'M154 128 Q162 134 166 126'}
                                stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" fill="none"
                            />
                        </motion.g>
                    </motion.g>

                    {/* — Neck — */}
                    <rect x="93" y="80" width="14" height="18" rx="5" fill="#fbbf24" />

                    {/* — Head — */}
                    <motion.g
                        animate={lifting ? { rotate: -10, y: -2 } : fail ? { rotate: 8, y: 4 } : { rotate: 0, y: 0 }}
                        style={{ transformOrigin: '100px 68px' }}
                        transition={spring(200, 18)}
                    >
                        {/* Head base */}
                        <ellipse cx="100" cy="62" rx="20" ry="22" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                        {/* Hair */}
                        <ellipse cx="100" cy="44" rx="19" ry="12" fill="#1f2937" />
                        <ellipse cx="100" cy="52" rx="20" ry="6" fill="#1f2937" />
                        {/* Sideburns */}
                        <rect x="80" y="54" width="6" height="12" rx="3" fill="#1f2937" />
                        <rect x="114" y="54" width="6" height="12" rx="3" fill="#1f2937" />
                        {/* Ears */}
                        <ellipse cx="80" cy="64" rx="4" ry="5" fill="#f59e0b" />
                        <ellipse cx="120" cy="64" rx="4" ry="5" fill="#f59e0b" />

                        {/* Eyes */}
                        {lifting ? (
                            <>
                                <path d="M90 62 Q93 59 96 62" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                                <path d="M104 62 Q107 59 110 62" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </>
                        ) : fail ? (
                            <>
                                <path d="M90 63 Q93 66 96 63" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                                <path d="M104 63 Q107 66 110 63" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                                {/* Tears */}
                                <ellipse cx="91" cy="67" rx="1.5" ry="2.5" fill="#60a5fa" opacity="0.8" />
                                <ellipse cx="109" cy="67" rx="1.5" ry="2.5" fill="#60a5fa" opacity="0.8" />
                            </>
                        ) : (
                            <>
                                <circle cx="92" cy="63" r="2.5" fill="#1f2937" />
                                <circle cx="108" cy="63" r="2.5" fill="#1f2937" />
                                <circle cx="93" cy="62" r="0.8" fill="white" />
                                <circle cx="109" cy="62" r="0.8" fill="white" />
                            </>
                        )}

                        {/* Eyebrows */}
                        {lifting ? (
                            <>
                                <path d="M88 57 Q93 54 97 56" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                                <path d="M103 56 Q107 54 112 57" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </>
                        ) : fail ? (
                            <>
                                <path d="M88 58 Q93 61 97 59" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                                <path d="M103 59 Q107 61 112 58" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </>
                        ) : (
                            <>
                                <path d="M88 57 Q93 55 97 57" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                <path d="M103 57 Q107 55 112 57" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            </>
                        )}

                        {/* Mouth */}
                        {lifting ? (
                            <path d="M93 72 Q100 78 107 72" stroke="#d97706" strokeWidth="2" strokeLinecap="round" fill="none" />
                        ) : fail ? (
                            <path d="M93 76 Q100 71 107 76" stroke="#d97706" strokeWidth="2" strokeLinecap="round" fill="none" />
                        ) : (
                            <path d="M94 71 Q100 76 106 71" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        )}

                        {/* Sweat drop when lifting */}
                        {lifting && (
                            <motion.ellipse
                                cx="116" cy="58"
                                rx="2.5" ry="4"
                                fill="#60a5fa"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: [0, 1, 0], y: [0, 8, 16] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn' }}
                            />
                        )}
                    </motion.g>
                </motion.g>

                {/* ===== SUCCESS SPARKLES ===== */}
                <AnimatePresence>
                    {lifting && (
                        <>
                            {[
                                [22, 24, '✨'], [174, 20, '⭐'], [18, 68, '💪'], [178, 65, '✨'],
                            ].map(([x, y, emoji], i) => (
                                <motion.text
                                    key={`spark-${i}`}
                                    x={x} y={y}
                                    fontSize={i === 2 ? '16' : '14'}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: [0, 1, 0.7, 1], scale: 1, y: y - 12 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ delay: i * 0.12, duration: 0.6, repeat: Infinity, repeatType: 'mirror' }}
                                >
                                    {emoji}
                                </motion.text>
                            ))}
                        </>
                    )}
                </AnimatePresence>

                {/* ===== FAIL MARKS ===== */}
                <AnimatePresence>
                    {fail && (
                        <>
                            {[[18, 35, '💥'], [162, 30, '💥']].map(([x, y, emoji], i) => (
                                <motion.text
                                    key={`fail-${i}`}
                                    x={x} y={y}
                                    fontSize="20"
                                    initial={{ opacity: 0, scale: 0, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                                >
                                    {emoji}
                                </motion.text>
                            ))}
                        </>
                    )}
                </AnimatePresence>

                {/* ===== IDLE pulse ring ===== */}
                {idle && (
                    <motion.circle
                        cx="100" cy="120" r="70"
                        stroke="#10b981"
                        strokeWidth="1"
                        fill="none"
                        opacity={0.15}
                        animate={{ r: [68, 78, 68], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
            </svg>

            <motion.p
                key={state}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground font-semibold tracking-widest uppercase"
            >
                {lifting ? '💪 Força total!' : fail ? '😓 Tenta outra vez...' : 'Faz o teu login'}
            </motion.p>
        </div>
    );
}

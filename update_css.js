const fs = require('fs');
const css = `
/* ========================================
   NEW FEATURES (Anamnese, Medidas, Exames, Gamification, Print)
   ======================================== */

/* --- Modal Tabs --- */
.modal-tabs {
    display: flex;
    gap: 8px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 16px;
}
.modal-tab {
    background: none;
    border: none;
    padding: 8px 16px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
}
.modal-tab:hover {
    color: var(--text-primary);
}
.modal-tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}
.tab-content {
    display: none;
}
.tab-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

/* --- Gamification Badges --- */
.achievements-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}
.badge-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}
.badge-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    border-radius: 50%;
    box-shadow: var(--shadow-sm);
}
.badge-info {
    flex: 1;
    min-width: 0;
}
.badge-title {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-primary);
    margin-bottom: 2px;
}
.badge-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.badge-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 4px;
}
.patient-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed var(--border-color);
}
.patient-badge-mini {
    font-size: 14px;
    background: var(--bg-secondary);
    padding: 2px 6px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

/* --- Medidas & Exames Layout --- */
.medidas-layout, .exames-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
    align-items: start;
}
@media (max-width: 1024px) {
    .medidas-layout, .exames-layout { grid-template-columns: 1fr; }
}

.history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.history-item {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
}
.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
}
.history-date {
    font-weight: 600;
    color: var(--text-primary);
}
.history-actions button {
    background: none;
    border: none;
    color: var(--danger-color);
    cursor: pointer;
    font-size: 0.85rem;
}
.history-actions button:hover {
    text-decoration: underline;
}

.medida-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
}
.medida-stat {
    background: var(--bg-primary);
    padding: 8px;
    border-radius: 6px;
    text-align: center;
    border: 1px solid var(--border-color);
}
.medida-stat-lbl {
    font-size: 0.75rem;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 2px;
}
.medida-stat-val {
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}
.trend-up { color: var(--danger-color); }
.trend-down { color: var(--success-color); }
.trend-eq { color: var(--text-muted); }

.exame-table {
    width: 100%;
    border-collapse: collapse;
}
.exame-table th, .exame-table td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.85rem;
}
.exame-table th {
    color: var(--text-secondary);
    font-weight: 500;
}
.status-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
}
.status-Normal { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-Atenção { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-Alterado { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

html[data-theme="dark"] .status-Normal { background: rgba(16, 185, 129, 0.2); }
html[data-theme="dark"] .status-Atenção { background: rgba(245, 158, 11, 0.2); }
html[data-theme="dark"] .status-Alterado { background: rgba(239, 68, 68, 0.2); }

/* --- Print Stylesheet --- */
@media print {
    body * {
        visibility: hidden;
    }
    #print-diet, #print-diet * {
        visibility: visible;
    }
    #print-diet {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
        background: white;
        color: black;
        font-family: 'Inter', sans-serif;
    }
    .print-header {
        text-align: center;
        border-bottom: 2px solid #000;
        padding-bottom: 20px;
        margin-bottom: 30px;
    }
    .print-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .print-subtitle { font-size: 14px; color: #555; }
    
    .print-patient-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
    }
    
    .print-day {
        margin-bottom: 30px;
        page-break-inside: avoid;
    }
    .print-day-title {
        font-size: 18px;
        font-weight: bold;
        background: #e9ecef;
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 15px;
    }
    
    .print-meal {
        margin-bottom: 15px;
        padding-left: 15px;
        border-left: 3px solid #ccc;
        page-break-inside: avoid;
    }
    .print-meal-header {
        font-weight: bold;
        margin-bottom: 5px;
        display: flex;
        gap: 10px;
    }
    .print-meal-time { color: #555; }
    .print-meal-foods { margin-bottom: 5px; white-space: pre-wrap; }
    .print-meal-macros { font-size: 12px; color: #666; font-style: italic; }
    .print-meal-obs { font-size: 12px; color: #d9534f; margin-top: 3px; }
    
    .print-footer {
        margin-top: 50px;
        text-align: center;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #ccc;
        padding-top: 15px;
    }
}
`;
fs.appendFileSync('style.css', css);
console.log('CSS appended.');

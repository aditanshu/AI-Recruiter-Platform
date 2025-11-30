import React from 'react';

const MatchScoreBadge = ({ score }) => {
    const getScoreStyle = (score) => {
        if (score >= 80) return {
            bg: 'rgba(16, 185, 129, 0.2)',
            border: 'var(--accent-success)',
            color: 'var(--accent-success)',
        };
        if (score >= 60) return {
            bg: 'rgba(59, 130, 246, 0.2)',
            border: 'var(--accent-primary)',
            color: 'var(--accent-primary)',
        };
        if (score >= 40) return {
            bg: 'rgba(245, 158, 11, 0.2)',
            border: 'var(--accent-warning)',
            color: 'var(--accent-warning)',
        };
        return {
            bg: 'rgba(239, 68, 68, 0.2)',
            border: 'var(--accent-error)',
            color: 'var(--accent-error)',
        };
    };

    const style = getScoreStyle(score);

    return (
        <div style={{
            ...styles.badge,
            background: style.bg,
            borderColor: style.border,
            color: style.color,
        }}>
            <span style={styles.score}>{score}%</span>
            <span style={styles.label}>Match</span>
        </div>
    );
};

const styles = {
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        border: '2px solid',
        fontWeight: '700',
        fontSize: '0.9rem',
    },
    score: {
        fontSize: '1.1rem',
    },
    label: {
        fontSize: '0.8rem',
        opacity: 0.9,
    },
};

export default MatchScoreBadge;

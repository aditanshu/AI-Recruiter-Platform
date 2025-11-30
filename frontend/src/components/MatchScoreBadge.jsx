import React from 'react';

const MatchScoreBadge = ({ score }) => {
    // Determine color based on score
    const getColor = (score) => {
        if (score >= 80) return '#4CAF50'; // Green
        if (score >= 60) return '#FF9800'; // Orange
        if (score >= 40) return '#FFC107'; // Yellow
        return '#f44336'; // Red
    };

    const color = getColor(score);

    return (
        <div style={{ ...styles.badge, backgroundColor: color }}>
            <span style={styles.label}>Match:</span>
            <span style={styles.score}>{score}%</span>
        </div>
    );
};

const styles = {
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    label: {
        fontSize: '0.8rem',
        opacity: 0.9,
    },
    score: {
        fontSize: '1rem',
    },
};

export default MatchScoreBadge;

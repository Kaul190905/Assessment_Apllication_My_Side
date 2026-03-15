// Empty assessment data for the dashboard
export const assessments = {
    upcoming: [],
    live: [],
    completed: [],
    missed: []
};

// Helper function to group assessments by subject
export const groupBySubject = (assessmentList) => {
    return assessmentList.reduce((groups, assessment) => {
        const subject = assessment.subject;
        if (!groups[subject]) {
            groups[subject] = [];
        }
        groups[subject].push(assessment);
        return groups;
    }, {});
};

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherAccount',
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    lectures: [{
        title: String,
        description: String,
        video: String,
        documents: [String],
        assignments: [{
            title: String,
            description: String,
            attachments: [String],
            dueDate: Date
        }],
        quiz: {
            title: String,
            description: String,
            questions: [{
                question: String,
                options: [String],
                correctAnswer: Number,
                points: Number
            }],
            timeLimit: Number, // in minutes
            passingScore: Number
        }
    }],
    enrolledStudents: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentAccount'
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        completedLectures: [{
            lecture: Number,
            completedAt: Date
        }],
        completedAssignments: [{
            lecture: Number,
            assignment: Number,
            submittedAt: Date,
            files: [String],
            grade: Number,
            feedback: String
        }],
        quizResults: [{
            lecture: Number,
            attemptedAt: Date,
            score: Number,
            answers: [Number]
        }]
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        },
        reviews: [{
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StudentAccount'
            },
            rating: Number,
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema, 'courses');

module.exports = Course; 
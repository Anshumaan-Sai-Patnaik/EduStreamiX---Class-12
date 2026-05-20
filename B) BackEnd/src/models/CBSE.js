const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    link: {
        type: [String],
        required: true
    },
    lang: {
        type: String,
        enum: ["en", "hi", "te"],
        required: true
    },

    isOriginal: {
        type: Boolean,
        default: false
    }
}, { _id: false })

const CBSE_Schema = new mongoose.Schema({
    grade: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    units: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                resources: {
                    type: [resourceSchema],
                },

                chapters: {
                    type: [
                        {
                            name: {
                                type: String,
                                required: true
                            },
                            resources: {
                                type: [resourceSchema],
                                required: true
                            }
                        }
                    ],
                }
            }
        ],
        required: true
    }
})

module.exports = mongoose.model('CBSE_Syllabus', CBSE_Schema, 'CBSE_Syllabi_Intermediate');
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

const SSC_Schema = new mongoose.Schema({
    grade: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    type: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                resources: {
                    type: [resourceSchema],
                }
            }
        ],
        required: true
    }
})

module.exports = mongoose.model('SSC_Syllabus', SSC_Schema, 'SSC_Syllabi_Intermediate');
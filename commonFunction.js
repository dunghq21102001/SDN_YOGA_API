class commonFunction {
    static responseSuccess(model, type, lang) {
        if (lang == 'vi') return { message: `${type} ${model} thành công` }
        else return { message: `${type} ${model} successful` }
    }

    static responseError(model, type, lang) {
        if (lang == 'vi') return { message: `${type} ${model} thất bại` }
        else return { message: `${type} ${model} fail` }
    }

    static unknownError(lang) {
        if (lang == 'vi') return { message: 'Có lỗi sảy ra, vui lòng thử lại' }
        else return { message: 'Something went wrong! Please try again' }
    }
}

module.exports = commonFunction
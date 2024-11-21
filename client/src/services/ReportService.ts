import ApiService from './ApiService'

export const apiCreateReport = async (communityId: number, data: any) => {
    return ApiService.fetchData({
        url: `/community/${communityId}/create_report/`,
        method: 'POST',
        data,
    })
};

export const apiGetReports = async (communityId: number) => {
    return ApiService.fetchData({
        url: `/community/${communityId}/reports/`,
        method: 'GET',
    })
}

export const apiGetReportDetail = async (communityId: number, reportId: number) => {
    return ApiService.fetchData({
        url: `/community/${communityId}/reports/${reportId}/`,
        method: 'GET',
    })
}

export const apiDeleteReport = async (communityId: number, reportId: number) => {
    return ApiService.fetchData({
        url: `/community/${communityId}/reports/${reportId}/delete/`,
        method: 'DELETE',
    })
}

export const apiUpdateReportStatus = async (communityId: number, reportId: number, data: { status: number }) => {
    return ApiService.fetchData({
        url: `/community/${communityId}/reports/${reportId}/update_status/`,
        method: 'PATCH',
        data,
    });
};

const PRIMARY_COLOR = '#8B5CF6';
const SECONDARY_COLOR = '#A78BFA';
const SUCCESS_COLOR = '#10B981';
const WARNING_COLOR = '#F59E0B';
const ERROR_COLOR = '#EF4444';

export const antdTheme = {
    token: {
        colorPrimary: PRIMARY_COLOR,
        colorSuccess: SUCCESS_COLOR,
        colorWarning: WARNING_COLOR,
        colorError: ERROR_COLOR,
        colorInfo: PRIMARY_COLOR,
        borderRadius: 12,
        colorBgContainer: '#FFFFFF',
        colorBgElevated: '#FFFFFF',
        colorBgLayout: '#F8FAFC',
        colorBgSpotlight: '#FFFFFF',
        colorText: '#1F2937',
        colorTextSecondary: '#6B7280',
        colorTextTertiary: '#9CA3AF',
        colorTextQuaternary: '#D1D5DB',
        colorBorder: '#E5E7EB',
        colorBorderSecondary: '#F3F4F6',
        colorLink: PRIMARY_COLOR,
        colorLinkHover: '#7C3AED',
        colorLinkActive: '#6D28D9',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    components: {
        Button: {
            borderRadius: 12,
            controlHeight: 48,
            colorPrimary: PRIMARY_COLOR,
            colorPrimaryHover: '#7C3AED',
            colorPrimaryActive: '#6D28D9',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
        Input: {
            borderRadius: 12,
            controlHeight: 48,
            colorBorder: '#E5E7EB',
            colorBorderHover: PRIMARY_COLOR,
            colorBorderFocus: PRIMARY_COLOR,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
        Card: {
            borderRadius: 16,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            colorBgContainer: '#FFFFFF',
        },
        Layout: {
            siderBg: '#F8FAFC',
            headerBg: '#FFFFFF',
            bodyBg: '#F8FAFC',
        },
        Menu: {
            borderRadius: 12,
            colorItemBg: 'transparent',
            colorItemBgHover: '#F3F4F6',
            colorItemBgSelected: PRIMARY_COLOR,
            colorItemText: '#6B7280',
            colorItemTextHover: PRIMARY_COLOR,
            colorItemTextSelected: '#FFFFFF',
        },
        Avatar: {
            borderRadius: 12,
            colorBgContainer: '#F3F4F6',
        },
        Typography: {
            colorText: '#1F2937',
            colorTextSecondary: '#6B7280',
            colorTextTertiary: '#9CA3AF',
        },
    },
};
export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/to-do-list',
		name: 'ToDoList',
		component: './ToDoList',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/tien-do-hoc-tap',
		name: 'Theo dõi tiến độ học tập',
		component: './TienDoHocTap/index.tsx',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/number-guessing-game',
		name: 'Number Guessing Game',
		component: './NumberGuessingGame',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/rock-paper-scissors',
		name: 'Rock Paper Scissors',
		component: './TH2/Bai1',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/ngan-hang-cau-hoi',
		name: 'Ngân hàng câu hỏi',
		component: './TH2/Bai2',
		icon: 'ArrowsAltOutlined',
	},
	{
		name: "Appointment Booking",
		path: "ThucHanh03/Booking",
		icon: "CalendarOutlined",
		routes: [
		  {
			name: "Staff Management",
			path: "staff",
			component: "./TH3/Booking/StaffManagement",
			icon: "UserOutlined",
		  },
		  {
			name: "Service Management",
			path: "services",
			component: "./TH3/Booking/ServiceManagement",
			icon: "ToolOutlined",
		  },
		  {
			name: "Appointment Management",
			path: "appointments",
			component: "./TH3/Booking/AppointmentManagement",
			icon: "CalendarOutlined",
		  },
		  {
			name: "Dashboard",
			path: "dashboard",
			component: "./TH3/Booking/Dashboard",
			icon: "DashboardOutlined",
		  }
		],
	  },
	  {
        name: "Quản lý văn bằng",
        path: "QuanLyVanBang",
        component: "./TH4",
        icon: "FileTextOutlined",
        routes: [
            {
                name: "Tổng quan",
                path: "./",
                component: "./TH4/Dashboard",
                icon: "DashboardOutlined",
            },
            {
                name: "Sổ văn bằng",
                path: "registers",
                component: "./TH4/CertificateRegister/RegisterList",
                icon: "BookOutlined",
            },
            {
                name: "Quyết định tốt nghiệp",
                path: "decisions",
                component: "./TH4/GraduationDecision/DecisionList",
                icon: "FileTextOutlined",
            },
            {
                name: "Cấu hình biểu mẫu",
                path: "template",
                component: "./TH4/TemplateConfig",
                icon: "FormOutlined",
            },
            {
                name: "Quản lý văn bằng",
                path: "certificates",
                component: "./TH4/CertificateManagement",
                icon: "UserOutlined",
            },
            {
                name: "Tra cứu văn bằng",
                path: "lookup",
                component: "./TH4/CertificateLookup",
                icon: "SearchOutlined",
            }
        ]
    },
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];

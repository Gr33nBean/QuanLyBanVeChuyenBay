import db from '../models/index';
const { QueryTypes } = require('sequelize');

class StaffController {
    // "/staff/"
    async index(req, res) {
        try {
            let SanBays = await db.sequelize.query(
                'select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let HangGhes = await db.sequelize.query(
                `select MaHangGhe , TenHangGhe from hangghe where hangghe.TrangThai = 'apdung' `,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            return res.render('staff/TraCuuChuyenBay', {
                layout: 'staff.handlebars',
                SanBays: SanBays,
                HangGhes: HangGhes,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/staff/flightdetail"
    async flightdetail(req, res) {
        try {
            let Package = JSON.parse(req.body.Package);
            console.log(Package);
            return res.render('staff/ChiTietChuyenBay', {
                layout: 'staff.handlebars',
                Package: Package,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // "/staff/flightdetail/editdetail"
    async editdetail(req, res) {
        try {
            let SanBays = await db.sequelize.query(
                'select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let HangGhes = await db.sequelize.query(
                `select MaHangGhe , TenHangGhe from hangghe where hangghe.TrangThai = 'apdung' `,
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            let Flight_Edit = JSON.parse(req.body.Flight_Edit);
            Flight_Edit['SanBays'] = structuredClone(SanBays);
            Flight_Edit['HangGhes'] = structuredClone(HangGhes);

            return res.render('staff/ChinhSuaChuyenBay', {
                layout: 'staff.handlebars',
                Flight_Edit: Flight_Edit,
                Flight_EditJS: JSON.stringify(Flight_Edit),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // 'staff/QuyDinh'
    async Regulations(req, res) {
        try {
            let ThamSos = await db.sequelize.query('select TenThamSo, TenHIenThi, NgayHieuLuc , GiaTri from thamso', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let TinhThanhs = await db.sequelize.query('select MaTinhThanh , TenTinhThanh from tinhthanh', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let HangGhes = await db.sequelize.query('select MaHangGhe , TenHangGhe, HeSo, TrangThai from hangghe', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let LoaiKhachHangs = await db.sequelize.query(
                'select MaLoaiKhach as MaLoaiKhachHang, TenLoai as TenLoaiKhachHang, SoTuoiToiThieu,SoTuoiToiDa, HeSo from loaikhachhang',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            let MocHanhLys = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa ,GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            for (let i = 0; i < SanBays.length; i++) {
                SanBays[i].TinhThanhs = structuredClone(TinhThanhs);
                SanBays[i].TinhThanhs = TinhThanhs;
            }
            return res.render('staff/QuyDinh', {
                layout: 'staff.handlebars',
                ThamSos: ThamSos,
                SanBays: SanBays,
                TinhThanhs: TinhThanhs,
                HangGhes: HangGhes,
                LoaiKhachHangs: LoaiKhachHangs,
                MocHanhLys: MocHanhLys,
            });
        } catch (error) {
            console.log(error);
        }
    }
    // Load màn hình quy định
    async LoadRegulation(req, res) {
        try {
            let Package = {};
            let ThamSos = await db.sequelize.query('select TenThamSo, TenHIenThi, NgayHieuLuc , GiaTri from thamso', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let TinhThanhs = await db.sequelize.query('select MaTinhThanh , TenTinhThanh from tinhthanh', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let HangGhes = await db.sequelize.query('select MaHangGhe , TenHangGhe, HeSo, TrangThai from hangghe', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let LoaiKhachHangs = await db.sequelize.query(
                'select MaLoaiKhach as MaLoaiKhachHang, TenLoai as TenLoaiKhachHang, SoTuoiToiThieu, SoTuoiToiDa, HeSo from loaikhachhang',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            let MocHanhLys = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa, GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            Package.ThamSos = structuredClone(ThamSos);
            Package.SanBays = structuredClone(SanBays);
            Package.TinhThanhs = structuredClone(TinhThanhs);
            Package.HangGhes = structuredClone(HangGhes);
            Package.LoaiKhachHangs = structuredClone(LoaiKhachHangs);
            Package.MocHanhLys = structuredClone(MocHanhLys);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }
    // cập nhật tham số
    async UpdateThamSo(req, res) {
        try {
            let P_ThamSo = req.body;
            let U_ThamSo = await db.ThamSo.findAll({});
            for (let i = 0; i < U_ThamSo.length; i++) {
                await U_ThamSo[i].set({
                    GiaTri: parseInt(P_ThamSo[i]),
                });
                await U_ThamSo[i].save();
            }
            return res.send(U_ThamSo);
        } catch (error) {
            console.log(error);
        }
    }

    //cập nhật sân bay
    async UpdateSanBay(req, res) {
        try {
            let SanBay_P = req.body;
            let SanBay_U = SanBay_P.SanBays_P_Update;
            let SanBay_A = SanBay_P.SanBays_P_Add;
            let SanBay = await db.SanBay.findAll({});
            for (let i = 0; i < SanBay_U.length; i++) {
                if (SanBay_U[i].ID_Update == 1) {
                    await SanBay[i].set({
                        TenSanBay: SanBay_U[i].TenSanBay,
                        MaTinhThanh: SanBay_U[i].MaTinhThanh,
                        TrangThai: SanBay_U[i].TrangThai,
                    });
                    await SanBay[i].save();
                }
            }
            console.log(SanBay_A);
            for (let i = 0; i < SanBay_A.length; i++) {
                await db.SanBay.create({
                    MaSanBay: SanBay_A[i].MaSanBay,
                    TenSanBay: SanBay_A[i].TenSanBay,
                    MaTinhThanh: SanBay_A[i].MaTinhThanh,
                    TrangThai: SanBay_A[i].TrangThai,
                });
            }
            let Package = [];
            let SanBays = await db.sequelize.query('select MaSanBay , TenSanBay, TrangThai, MaTinhThanh from sanbay', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            Package = structuredClone(SanBays);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    // cập nhật hạng ghế
    async UpdateHangGhe(req, res) {
        try {
            let HangGhe_P = req.body;
            let HangGhe_U = HangGhe_P.HangGhes_P_Update;
            let HangGhe_A = HangGhe_P.HangGhes_P_Add;
            let HangGhe = await db.HangGhe.findAll({});
            for (let i = 0; i < HangGhe_U.length; i++) {
                if (HangGhe_U[i].ID_Update == 1) {
                    await HangGhe[i].set({
                        TenHangGhe: HangGhe_U[i].TenHangGhe,
                        HeSo: HangGhe_U[i].HeSo,
                        TrangThai: HangGhe_U[i].TrangThai,
                    });
                    await HangGhe[i].save();
                }
            }
            console.log(HangGhe_A);
            for (let i = 0; i < HangGhe_A.length; i++) {
                await db.HangGhe.create({
                    MaHangGhe: HangGhe_A[i].MaHangGhe,
                    TenHangGhe: HangGhe_A[i].TenHangGhe,
                    HeSo: HangGhe_A[i].HeSo,
                    TrangThai: HangGhe_A[i].TrangThai,
                });
            }
            let Package = [];

            let HangGhes = await db.sequelize.query('select MaHangGhe , TenHangGhe, HeSo , TrangThai from HangGhe', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            Package = structuredClone(HangGhes);
            console.log(Package);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    // cập nhật loại khách hàng
    async UpdateLoaiKhachHang(req, res) {
        try {
            let LoaiKhachHang_P = req.body;
            let LoaiKhachHang_U = LoaiKhachHang_P.LoaiKhachHangs_P_Update;
            let LoaiKhachHang_A = LoaiKhachHang_P.LoaiKhachHangs_P_Add;
            let LoaiKhachHang = await db.LoaiKhachHang.findAll({});
            for (let i = 0; i < LoaiKhachHang_U.length; i++) {
                if (LoaiKhachHang_U[i].ID_Update == 1) {
                    await LoaiKhachHang[i].set({
                        TenLoai: LoaiKhachHang_U[i].TenLoaiKhachHang,
                        SoTuoiToiDa: LoaiKhachHang_U[i].SoTuoiToiDa,
                        SoTuoiToiThieu: LoaiKhachHang_U[i].SoTuoiToiThieu,
                        HeSo: LoaiKhachHang_U[i].HeSo,
                    });
                    await LoaiKhachHang[i].save();
                }
            }
            console.log(LoaiKhachHang_A);
            for (let i = 0; i < LoaiKhachHang_A.length; i++) {
                await db.LoaiKhachHang.create({
                    TenLoai: LoaiKhachHang_A[i].TenLoaiKhachHang,
                    SoTuoiToiDa: LoaiKhachHang_A[i].SoTuoiToiDa,
                    SoTuoiToiThieu: LoaiKhachHang_A[i].SoTuoiToiThieu,
                    HeSo: LoaiKhachHang_A[i].HeSo,
                });
            }
            let Package = [];

            let LoaiKhachHangs = await db.sequelize.query(
                'select MaLoaiKhach as MaLoaiKhachHang, TenLoai as TenLoaiKhachHang, SoTuoiToiThieu,SoTuoiToiDa, HeSo from loaikhachhang',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            Package = structuredClone(LoaiKhachHangs);
            console.log(Package);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    // cập nhật mốc hành lý
    async UpdateMocHanhLy(req, res) {
        try {
            let MocHanhLy_P = req.body;
            let MocHanhLy_U = MocHanhLy_P.MocHanhLys_P_Update;
            let MocHanhLy_A = MocHanhLy_P.MocHanhLys_P_Add;
            let MocHanhLy = await db.MocHanhLy.findAll({});
            for (let i = 0; i < MocHanhLy_U.length; i++) {
                if (MocHanhLy_U[i].ID_Update == 1) {
                    await MocHanhLy[i].set({
                        SoKgToiDa: MocHanhLy_U[i].SoKgToiDa,
                        GiaTien: MocHanhLy_U[i].GiaTien,
                    });
                    await MocHanhLy[i].save();
                }
            }
            console.log(MocHanhLy_A);
            for (let i = 0; i < MocHanhLy_A.length; i++) {
                await db.MocHanhLy.create({
                    SoKgToiDa: MocHanhLy_A[i].SoKgToiDa,
                    GiaTien: MocHanhLy_A[i].GiaTien,
                });
            }
            let Package = [];

            let MocHanhLys = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa, GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            Package = structuredClone(MocHanhLys);
            console.log(Package);
            return res.send(Package);
        } catch (error) {
            console.log(error);
        }
    }

    //staff/Authorization
    async Authorization(req, res) {
        try {
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let Users = await db.sequelize.query(
                'select MaUser, Email, MatKhau,HoTen ,SDT,  CCCD, GioiTinh, NgaySinh, MaChucVu, HinhAnh, TrangThai from user ',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            for (let i = 0; i < ChucVus.length; i++) {
                let U = [];
                let t = 0;
                for (let j = 0; j < Users.length; j++) {
                    if (Users[j].MaChucVu == ChucVus[i].MaChucVu) {
                        U[t] = Users[j];
                        t++;
                    }
                }
                ChucVus[i].Users = structuredClone(U);
                ChucVus[i].SoLuong = U.length;
            }
            return res.render('staff/PhanQuyenChuyenBay', {
                layout: 'staff.handlebars',
                ChucVus: ChucVus,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff/AddPosition
    async AddPosition(req, res) {
        try {
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let Quyens = await db.sequelize.query('select MaQuyen, TenQuyen, TenManHinhDuocLoad from quyen', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            return res.render('staff/ThemChucVu', {
                layout: 'staff.handlebars',
                Quyens: Quyens,
                ChucVus: JSON.stringify(ChucVus),
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//EditPosition
    async EditPosition(req, res) {
        try {
            let ChucVu = {};
            ChucVu.TenChucVu = req.body.Package;
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            for (let i = 0; i < ChucVus.length; i++) {
                if (ChucVus[i].TenChucVu == ChucVu.TenChucVu) {
                    ChucVu.MaChucVu = ChucVus[i].MaChucVu;
                    break;
                }
            }
            let PhanQuyens = await db.PhanQuyen.findAll();
            let P = [];
            for (let i = 0; i < PhanQuyens.length; i++) {
                if (PhanQuyens[i].MaChucVu == ChucVu.MaChucVu) {
                    P[PhanQuyens[i].MaQuyen] = 1;
                }
            }
            ChucVu.Quyens = structuredClone(P);
            let Quyens = await db.sequelize.query('select MaQuyen, TenQuyen, TenManHinhDuocLoad from quyen', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            return res.render('staff/SuaChucVu', {
                layout: 'staff.handlebars',
                ChucVus: JSON.stringify(ChucVus),
                ChucVu: JSON.stringify(ChucVu),
                Quyens: Quyens,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//ThemChucVu
    async ThemChucVu(req, res) {
        try {
            let ChucVu_P = req.body;
            await db.ChucVu.create({
                MaChucVu: ChucVu_P.MaChucVu,
                TenChucVu: ChucVu_P.TenChucVu,
            });
            for (let i = 0; i < ChucVu_P.Quyens.length; i++) {
                await db.PhanQuyen.create({
                    MaChucVu: ChucVu_P.MaChucVu,
                    MaQuyen: ChucVu_P.Quyens[i],
                });
            }
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }

    //staff//SuaChucVu
    async SuaChucVu(req, res) {
        try {
            let ChucVu_P = req.body;
            let ChucVu = await db.ChucVu.findAll();
            for (let i = 0; i < ChucVu.length; i++) {
                if (ChucVu[i].MaChucVu == ChucVu_P.MaChucVu) {
                    ChucVu[i].set({
                        TenChucVu: ChucVu_P.TenChucVu,
                    });
                    await ChucVu[i].save();
                }
            }

            await db.sequelize.query("Delete from phanquyen where MaChucVu = '" + ChucVu_P.MaChucVu + "'");
            for (let i = 0; i < ChucVu_P.Quyens.length; i++) {
                await db.PhanQuyen.create({
                    MaChucVu: ChucVu_P.MaChucVu,
                    MaQuyen: ChucVu_P.Quyens[i],
                });
            }
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }

    //staff/AddUser
    async AddUser(req, res) {
        try {
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let Users = await db.sequelize.query(
                'select MaUser, Email,MatKhau,HoTen,CCCD,GioiTinh,NgaySinh,MaChucVu,HinhAnh,TrangThai,SDT from user',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            let MaChucVu = req.body.Package;
            return res.render('staff/ThemUser', {
                layout: 'staff.handlebars',
                MaChucVu: MaChucVu,
                Users: JSON.stringify(Users),
                ChucVus: ChucVus,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//EditUser
    async EditUser(req, res) {
        try {
            let ChucVus = await db.sequelize.query('select MaChucVu, TenChucVu from chucvu', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            let Users = await db.sequelize.query(
                'select MaUser, Email,MatKhau,HoTen,CCCD,GioiTinh,NgaySinh,MaChucVu,HinhAnh,TrangThai,SDT from user',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );
            let MaUser = req.body.Package;
            return res.render('staff/SuaUser', {
                layout: 'staff.handlebars',
                ChucVus: ChucVus,
                Users: JSON.stringify(Users),
                MaUser: MaUser,
            });
        } catch (error) {
            console.log(error);
        }
    }

    //staff//ThemUser
    async ThemUser(req, res) {
        try {
            let User_P = req.body;
            await db.User.create({
                MaUser: User_P.MaUser,
                MaChucVu: User_P.MaChucVu,
                MatKhau: User_P.MatKhau,
                HoTen: User_P.HoTen,
                GioiTinh: User_P.GioiTinh,
                NgaySinh: User_P.NgaySinh,
                CCCD: User_P.CCCD,
                SDT: User_P.SDT,
                TrangThai: 'HieuLuc',
                Email: User_P.Email,
            });
            console.log(User_P);
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }

    //staff//SuaUser
    async SuaUser(req, res) {
        try {
            let User_P = req.body;
            let User = await db.User.findOne({
                where: { MaUser: User_P.MaUser },
            });
            console.log(User);
            if (User) {
                User.set({
                    MaChucVu: User_P.MaChucVu,
                    HoTen: User_P.HoTen,
                    GioiTinh: User_P.GioiTinh,
                    NgaySinh: User_P.NgaySinh,
                    CCCD: User_P.CCCD,
                    SDT: User_P.SDT,
                    TrangThai: User_P.TrangThai == 1 ? 'HieuLuc' : 'VoHieu',
                    Email: User_P.Email,
                });
                User.save();
            }
            console.log(User_P);
            return res.send('tc');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new StaffController();

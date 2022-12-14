import mailConfig from '../config/mail.config';
import db from '../models/index';
import HoaDonController from './HoaDonController';
const { QueryTypes } = require('sequelize');
import Mailer from '../utils/mailer';

class ClientController {
    // "/"
    async index(req, res) {
        try {
            //let SanBays = [
            //     { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
            //     { MaSanBay: 'DAD', TenSanBay: 'Haha', TinhThanh: 'Đà Nẵng' },
            // ];
            let SanBays = await db.sequelize.query(
                'select MaSanBay , TenSanBay, TenTinhThanh as TinhThanh from sanbay, tinhthanh where sanbay.matinhthanh = tinhthanh.matinhthanh',
                {
                    type: QueryTypes.SELECT,
                    raw: true,
                },
            );

            // let HangGhes = [{ MaHangGhe: 'Eco', TenHangGhe: 'Phổ thông' }];
            let HangGhes = await db.HangGhe.findAll({
                attributes: ['MaHangGhe', 'TenHangGhe'],
                where: {
                    TrangThai: 'apdung',
                },
                raw: true,
            });

            //get so hanh khach toi da 1 chuyen bay
            let HanhKhach_Max = await db.ThamSo.findOne({
                attributes: ['GiaTri'],
                where: {
                    TenThamSo: 'HanhKhach_Max',
                },
                raw: true,
            });
            HanhKhach_Max = HanhKhach_Max.GiaTri;

            //get so so chuyen bay toi da 1 lan dat ve
            let ChuyenBay_Max = await db.ThamSo.findOne({
                attributes: ['GiaTri'],
                where: {
                    TenThamSo: 'ChuyenBay_Max',
                },
                raw: true,
            });
            ChuyenBay_Max = ChuyenBay_Max.GiaTri;

            return res.render('client/TraCuuChuyenBay', {
                layout: 'client.handlebars',
                SanBays: SanBays,
                HangGhes: HangGhes,
                HanhKhach_Max: HanhKhach_Max,
                ChuyenBay_Max: ChuyenBay_Max,
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/choose_flight" - TraCuuChuyenBay
    async choose_flight(req, res) {
        try {
            // From DB
            let HanhLy = await db.sequelize.query('select SoKgToiDa , GiaTien from mochanhly WHERE  GiaTien <> 0', {
                type: QueryTypes.SELECT,
                raw: true,
            });
            // Req.body
            let MangChuyenBayTimKiem = JSON.parse(req.body.MangChuyenBay);
            let HangGhe = JSON.parse(req.body.HangGhe);
            let HanhKhach = JSON.parse(req.body.HanhKhach);
            for (let i = 0; i < MangChuyenBayTimKiem.length; i++) {
                MangChuyenBayTimKiem[i]['ThuTu'] = i + 1;
                MangChuyenBayTimKiem[i]['ChuyenBayDaChon'] = {
                    MaChuyenBay: '',
                    ThoiGianDi: { GioDi: { Gio: -1, Phut: -1 }, NgayDi: { Ngay: -1, Thang: -1, Nam: -1 } },
                    SanBayDi: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                    ThoiGianDen: { GioDen: { Gio: -1, Phut: -1 }, NgayDen: { Ngay: -1, Thang: -1, Nam: -1 } },
                    SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                    ThoiGianBay: { Gio: -1, Phut: -1 },
                    SoDiemDung: -1,
                    GiaVe: -1,
                    ChanBay: [
                        {
                            ThoiGianDi: {
                                GioDi: { Gio: -1, Phut: -1 },
                                NgayDi: { Ngay: -1, Thang: -1, Nam: -1 },
                            },
                            SanBayDi: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                            ThoiGianDen: {
                                GioDen: { Gio: -1, Phut: -1 },
                                NgayDen: { Ngay: -1, Thang: -1, Nam: -1 },
                            },
                            SanBayDen: { MaSanBay: '', TenSanBay: '', TinhThanh: '' },
                            ThoiGianBay: { Gio: -1, Phut: -1 },
                            ThoiGianDung_SanBayDen: { Gio: -1, Phut: -1 },
                        },
                    ],
                };
            }

            let PackageBooking_ = {
                MangChuyenBayTimKiem: MangChuyenBayTimKiem,
                HangGhe: HangGhe,
                HanhKhach: HanhKhach,
                HanhLy: HanhLy,
            };
            return res.render('client/ChonChuyenBay', {
                layout: 'client.handlebars',
                PackageBooking: PackageBooking_,
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/pre-booking" - TomTatTruocDat
    async prebooking(req, res) {
        try {
            let form = JSON.parse(req.body.PackageBooking);
            let mangchuyenbay = [...form.MangChuyenBayTimKiem];
            let manghanhkhach = [...form.HanhKhach];

            for (var i = 0; i < mangchuyenbay.length; i++) {
                mangchuyenbay[i] = {
                    MaChuyenBay: mangchuyenbay[i].ChuyenBayDaChon.MaChuyenBay,
                    GiaVe: mangchuyenbay[i].ChuyenBayDaChon.GiaVe,
                };
            }

            let tile_loaihanhkhach = await db.LoaiKhachHang.findAll({});

            for (var i = 0; i < manghanhkhach.length; i++) {
                for (var j = 0; j < tile_loaihanhkhach.length; j++) {
                    if (manghanhkhach[i].title == tile_loaihanhkhach[j].TenLoai) {
                        manghanhkhach[i].HeSo = tile_loaihanhkhach[j].HeSo;
                        manghanhkhach[i].TongTienVe = 0;
                        break;
                    }
                }
            }

            // let GiaVe_TreEm = db.ThamSo.findOne({
            //     where: {
            //         TenThamSo: 'GiaVeTreEm',
            //     },
            // });
            let GiaVe_TreEm = 100000;

            //tong tien ve = gia ve chuyen bay * heso_hanhkhach * sohanhkhach
            for (var i = 0; i < mangchuyenbay.length; i++) {
                for (var j = 0; j < manghanhkhach.length; j++) {
                    if (manghanhkhach[j].title === 'Em bé')
                        manghanhkhach[j].TongTienVe += GiaVe_TreEm * parseInt(manghanhkhach[j].value);
                    else
                        manghanhkhach[j].TongTienVe +=
                            mangchuyenbay[i].GiaVe *
                            parseFloat(manghanhkhach[j].HeSo) *
                            parseInt(manghanhkhach[j].value);
                }
            }

            for (var i in manghanhkhach) delete manghanhkhach[i].HeSo;

            let PackageBooking_ = JSON.parse(req.body.PackageBooking);
            PackageBooking_.HanhKhach = manghanhkhach;

            let hangghe = await db.HangGhe.findOne({
                attributes: ['MaHangGhe', 'TenHangGhe', 'HeSo'],
                where: {
                    MaHangGhe: form.HangGhe.MaHangGhe,
                },
                raw: true,
            });
            PackageBooking_.HangGhe = hangghe;

            return res.render('client/TomTatTruocDat', {
                layout: 'client.handlebars',
                PackageBooking: PackageBooking_,
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/booking" - DienThongTin
    async booking(req, res) {
        try {
            let PackageBooking_ = JSON.parse(req.body.PackageBooking);

            let HeSoHanhKhach = await db.sequelize.query('select MaLoaiKhach, TenLoai , HeSo from loaikhachhang', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            for (let i = 0; i < PackageBooking_.HanhKhach.length; i++) {
                const HeSo = HeSoHanhKhach.find((item) => item.TenLoai == PackageBooking_.HanhKhach[i].title);
                PackageBooking_.HanhKhach[i]['HeSo'] = HeSo.HeSo;
                PackageBooking_.HanhKhach[i]['MaLoaiKhach'] = HeSo.MaLoaiKhach;
            }

            let MocHanhLy = await db.sequelize.query('select MaMocHanhLy, SoKgToiDa, GiaTien from mochanhly', {
                type: QueryTypes.SELECT,
                raw: true,
            });

            PackageBooking_.HanhLy = MocHanhLy;

            let HanhKhach = [];
            let index = 0;
            for (let j = 0; j < PackageBooking_.HanhKhach.length; j++) {
                for (let z = 0; z < PackageBooking_.HanhKhach[j].value; z++) {
                    HanhKhach.push({
                        index: index,
                        MaLoaiKhach: PackageBooking_.HanhKhach[j].MaLoaiKhach,
                        TenLoai: PackageBooking_.HanhKhach[j].title,
                        ThuTu: z + 1,
                        GioiTinh: -1,
                        Ho: '',
                        Ten: '',
                        NgaySinh: { Ngay: 0, Thang: 0, Nam: 0 },
                    });
                    index++;
                }
            }

            let MangChuyenBayDat = [];
            let LoaiKhachEmBe = PackageBooking_.HanhKhach.find((item) => item.title == 'Em bé').MaLoaiKhach;
            for (let i = 0; i < PackageBooking_.MangChuyenBayTimKiem.length; i++) {
                let CBDChon = PackageBooking_.MangChuyenBayTimKiem[i].ChuyenBayDaChon;
                let MaMocHanhLy = [];
                for (let j = 0; j < HanhKhach.length; j++) {
                    if (HanhKhach[j].MaLoaiKhach == LoaiKhachEmBe) MaMocHanhLy.push(-1);
                    else MaMocHanhLy.push(0);
                }
                MangChuyenBayDat.push({ MaChuyenBay: CBDChon.MaChuyenBay, MaMocHanhLy: MaMocHanhLy });
            }

            PackageBooking_['HoaDon'] = {
                NguoiLienHe: { Ho: '', Ten: '', SDT: 0, Email: '' },
                MaHangGhe: PackageBooking_.HangGhe.MaHangGhe,
                NgayGioDat: '',
                MangChuyenBayDat: MangChuyenBayDat,
                HanhKhach: HanhKhach,
            };

            console.log(PackageBooking_);
            return res.render('client/DienThongTin', {
                layout: 'client.handlebars',
                PackageBooking: PackageBooking_,
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    // "/payment" - ThanhToan
    async payment(req, res) {
        try {
            let PackageBooking_ = JSON.parse(req.body.PackageBooking);
            let HoaDon = await HoaDonController.CreateHoaDon(PackageBooking_.HoaDon);
            return res.render('client/ThanhToan', {
                layout: 'client.handlebars',
                HoaDon: JSON.stringify(HoaDon),
                PackageBookingJS: JSON.stringify(PackageBooking_),
            });
        } catch (error) {
            console.log(error);
        }
    }

    //#region Mã xác nhận
    // data_req = { Email: '' };
    // res =  { Code: 'xxxxxx' }; x -> (0,9)
    // if(err) res = { Code: '-1' }
    async validateCode(req, res) {
        try {
            function RandomNum(min, max) {
                return parseInt(Math.random() * (max - min) + min);
            }

            let Email = req.body.Email;

            let num1 = RandomNum(0, 10); //0-9
            let num2 = RandomNum(0, 10);
            let num3 = RandomNum(0, 10);
            let num4 = RandomNum(0, 10);
            let num5 = RandomNum(0, 10);
            let num6 = RandomNum(0, 10);

            let Code = '' + num1 + num2 + num3 + num4 + num5 + num6;

            await Mailer.sendMail(Email, 'Verify mail', `<p>Your verify code: ${Code} </p>`);

            return res.send({ Code: Code });
        } catch (error) {
            console.log(error);
            return res.send({ Code: '-1' });
        }
    }
    //#endregion
}

module.exports = new ClientController();

/* Phần ghi chú-Back up */
// let ChuyenBays = [
//     {
//         MaChuyenBay: '1',
//         ThoiGianDi: { GioDi: { Gio: 1, Phut: 11 }, NgayDi: { Ngay: 1, Thang: 1, Nam: 2023 } },
//         SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
//         ThoiGianDen: { GioDen: { Gio: 12, Phut: 12 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
//         SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
//         ThoiGianBay: { Gio: 25, Phut: 1 },
//         SoDiemDung: 1,
//         GiaVe: 500000,
//         ChanBay: [
//             {
//                 ThoiGianDi: { GioDi: { Gio: 11, Phut: 11 }, NgayDi: { Ngay: 1, Thang: 1, Nam: 2023 } },
//                 SanBayDi: { MaSanBay: 'TSN', TenSanBay: 'Tân Sơn Nhất', TinhThanh: 'HCM' },
//                 ThoiGianDen: { GioDen: { Gio: 6, Phut: 6 }, NgayDen: { Ngay: 2, Thang: 1, Nam: 2023 } },
//                 SanBayDen: { MaSanBay: 'DAD', TenSanBay: 'Tân Sơn Nhì', TinhThanh: 'Đà Nẵng' },
//                 ThoiGianBay: { Gio: 5, Phut: 5 },
//                 ThoiGianDung_SanBayDen: { Gio: 0, Phut: 30 },
//             },
//         ],
//     },
// ];

// HoaDon:
// {
//     NguoiLienHe: {Ho:'', Ten:'', SDT:0, Email:''},
//     MaHangGhe:'',
//     NgayGioDat:'',
//     MangChuyenBayDat:
//         [   {   MaChuyenBay:0, MaMocHanhLy:[],  },  ],
//     HanhKhach:
//         [   {MaLoaiKhach: 3, GioiTinh:'', Ho:'', Ten:'', NgaySinh: {Ngay:0, Thang:0, Nam:0} }   ],
// },

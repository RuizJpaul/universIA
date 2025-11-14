import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";
import { getOrCreateStudentId } from "@/lib/get-student-id";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener o crear estudiante
    const studentId = await getOrCreateStudentId(pool, session.user.email);

    // Obtener perfil completo del estudiante
    const profileQuery = await pool.query(
      `SELECT 
        e.*,
        u.correo,
        u.rol,
        u.fecha_registro,
        u.ultima_conexion
      FROM estudiantes e
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      WHERE e.id_estudiante = $1`,
      [studentId]
    );

    const profile = profileQuery.rows[0];

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id_estudiante,
        userId: profile.id_usuario,
        email: profile.correo,
        firstName: profile.nombre,
        lastName: profile.apellido,
        birthDate: profile.fecha_nacimiento,
        specialty: profile.especialidad,
        academicLevel: profile.nivel_academico,
        phone: profile.telefono,
        country: profile.pais,
        city: profile.ciudad,
        bio: profile.biografia,
        profilePicture: profile.foto_perfil,
        linkedinUrl: profile.linkedin_url,
        githubUrl: profile.github_url,
        portfolioUrl: profile.portafolio_url,
        role: profile.rol,
        registeredAt: profile.fecha_registro,
        lastLogin: profile.ultima_conexion,
      },
    });

  } catch (error: any) {
    console.error("Error obteniendo perfil:", error);
    
    return NextResponse.json(
      { error: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Obtener o crear estudiante
    const studentId = await getOrCreateStudentId(pool, session.user.email);

    // Actualizar datos del estudiante
    const updateQuery = await pool.query(
      `UPDATE estudiantes
       SET 
         nombre = COALESCE($1, nombre),
         apellido = COALESCE($2, apellido),
         fecha_nacimiento = COALESCE($3, fecha_nacimiento),
         especialidad = COALESCE($4, especialidad),
         nivel_academico = COALESCE($5, nivel_academico),
         telefono = COALESCE($6, telefono),
         pais = COALESCE($7, pais),
         ciudad = COALESCE($8, ciudad),
         biografia = COALESCE($9, biografia),
         linkedin_url = COALESCE($10, linkedin_url),
         github_url = COALESCE($11, github_url),
         portafolio_url = COALESCE($12, portafolio_url),
         foto_perfil = COALESCE($13, foto_perfil)
       WHERE id_estudiante = $14
       RETURNING *`,
      [
        body.firstName,
        body.lastName,
        body.birthDate,
        body.specialty,
        body.academicLevel,
        body.phone,
        body.country,
        body.city,
        body.bio,
        body.linkedinUrl,
        body.githubUrl,
        body.portfolioUrl,
        body.profilePicture,
        studentId,
      ]
    );

    if (updateQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "No se pudo actualizar el perfil" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente",
    });

  } catch (error: any) {
    console.error("Error actualizando perfil:", error);
    
    return NextResponse.json(
      { error: "Error al actualizar perfil" },
      { status: 500 }
    );
  }
}

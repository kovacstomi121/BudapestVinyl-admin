const store = await prismadb.store.findFirst({
  where: {
    user: {
      email: values.email,
    },
  },
  include: {
    user: true, // Ez azért kell, hogy a kapcsolódó felhasználó objektum is elkészüljön
  },
});

if (store) {
  return NextResponse.json(store);
} else {
  // Ha nincs bolt, irányítás a root oldalra
  return NextResponse.redirect("/root");
}

StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
    t.ok(KiokuJS.Node, "KiokuJS.Node is here")
    
    var backend = new KiokuJS.Backend.Hash()
    
    t.ok(backend, "KiokuJS.Backend.Hash was instantiated")
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Graph setup')
    
    var Homer = new KiokuJS.Test.Person({
        name    : 'Homer Simpson'
    })
    
    var Marge = new KiokuJS.Test.Person({
        name    : 'Marge Simpson'
    })
    
    var Bart = new KiokuJS.Test.Person({
        name    : 'Bart Simpson'
    })
    
    var Lisa = new KiokuJS.Test.Person({
        name    : 'Lisa Simpson'
    })
    
    
    Homer.spouse(Marge)
    Marge.spouse(Homer)
    
    Bart.father     = Lisa.father  = Homer
    Bart.mother     = Lisa.mother  = Marge
    
    var kids = [ Bart, Lisa ]
    
    Homer.children = Marge.children = kids
    

    //======================================================================================================================================================================================================================================================
    t.diag('Encoding graph')
    
    var packet = backend.encodePacket({ 'homer' : Homer }, [ Lisa ])
    
    t.ok(packet, 'Something has been returned as the result')
    
    
    t.ok(packet.entries.length == 5, 'Packet contain 5 first-class entries')
    
    t.ok(packet.customIDs.homer, 'Packet contain `homer` custom ID')
    
    t.ok(packet.IDs.length == 1, 'Packet contain a single assigned ID')
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Decoding graph')
    
    var result = backend.decodePacket(packet)
    
    var custom  = result[0]
    var IDs     = result[1]
    
    var Homer2   = custom.homer
    delete custom.homer
    
    t.isaOk(Homer2, KiokuJS.Test.Person, 'Correctly decoded Homer with the custom ID')
    t.ok(Joose.O.isEmpty(custom), 'Object with custom IDs contains Homer only')
    
    t.ok(IDs.length == 1, 'Only a single object in IDs array')
    
    var Lisa2 = IDs[0]
    
    t.isaOk(Lisa2, KiokuJS.Test.Person, 'And it seems to be Lisa2')
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Checking graph')
    
    t.ok(Homer2.self == Homer2, 'Homer has correct self-reference')
    t.ok(Homer2.name == 'Homer Simpson', 'Homer has correct name')
    t.ok(Homer2.spouse().name == 'Marge Simpson', '.. and spouse')
    
    t.ok(Homer2 != Homer, 'But its a different copy of Homer')
    
    t.ok(Homer2.children[1] == Lisa2, 'Lisa2 is a child of Homer2')
    t.ok(Lisa2 != Lisa, 'But its a different copy of Lisa')
    
    t.ok(Lisa2.name == 'Lisa Simpson', 'Lisa has a correct name')
    t.ok(Lisa2.father == Homer2, 'Lisa has a correct father')
    
    
    t.done()
})    
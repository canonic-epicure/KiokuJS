COMPONENTS = {
    
    "Core" : [
        "KiokuJS.Reference",
        
        "KiokuJS.Exception",
        "KiokuJS.Exception.Network",
        "KiokuJS.Exception.Format",
        "KiokuJS.Exception.Overwrite",
        "KiokuJS.Exception.Update",
        "KiokuJS.Exception.Remove",
        "KiokuJS.Exception.LookUp",
        "KiokuJS.Exception.Conflict",
        
        "KiokuJS.Role.Serializer",
        "KiokuJS.Serializer.JSON",
        
        "KiokuJS.TypeMap",
        "KiokuJS.TypeMap.Role.NoDeps",
        "KiokuJS.TypeMap.Array",
        "KiokuJS.TypeMap.Object",
        "KiokuJS.TypeMap.Joose",
        
        "KiokuJS.Resolver",
        "KiokuJS.Resolver.Standard",
        
        "KiokuJS.Role.Resolvable",
        
        "KiokuJS.Node",
        
        "KiokuJS.Collapser.Encoder",
        "KiokuJS.Linker.Decoder",
        
        "KiokuJS.Linker.RefGatherer",
        "KiokuJS.Linker.Expander",
        
        "KiokuJS.Backend.Role.SkipFixture",
        "KiokuJS.Backend.Feature.Overwrite",
        "KiokuJS.Backend.Feature.Update",
        
        "KiokuJS.Backend",
        "KiokuJS.Backend.Hash",
        
        
        "KiokuJS.Collapser",
        "KiokuJS.Linker",
        
        "KiokuJS.Scope",
        "KiokuJS"
    ],
    
    
    "Test" : [
        "+Core",
        
        "KiokuJS.Test.Person",
        "KiokuJS.Test.Vertex",
        
        "KiokuJS.Test.Fixture",
        "KiokuJS.Test.Fixture.ObjectGraph",
        "KiokuJS.Test.Fixture.Overwrite",
        "KiokuJS.Test.Fixture.Update",
        "KiokuJS.Test.Fixture.Remove",
        "KiokuJS.Test.Fixture.Refresh",
        
        "KiokuJS.Test.Fixture.StressLoad.Tree",
        
        "KiokuJS.Test"
    ],
    
    
    "WebPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:JooseX.SimpleRequest",
        "jsan:Task.JooseX.Namespace.Depended.Web",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor"
    ],
    
    
    "NodeJSPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:Task.JooseX.Namespace.Depended.NodeJS",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor"
    ]
} 


